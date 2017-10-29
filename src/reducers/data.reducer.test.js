import dataReducer, { emptyState } from './data'
import _ from 'lodash'
import LogHit from '../domain/LogHit'
import {messageContainsCaptor, captorToPredicate, messageMatchesRegexCaptor, messageExtractor, keepPending } from '../domain/Captor'
import {captureConsoleError} from '../testutil/funmock'

const testConfig = {
    timeField: 'timestamp',
    messageField: 'message'
}

const toLogHit = (h) => LogHit(h, testConfig)

const captorForMessage = (key, messageSub) => captorToPredicate(messageContainsCaptor(key, messageSub))

describe('data reducer', () => {
    it('intial state is empty state', () => {
        expect(dataReducer(undefined, {}))
            .toEqual(emptyState)
    })
    it('resets back to empty state, except for the captors hack', () => {
        expect(dataReducer({
            data: { hits: [1, 2, 3] },
            captorPredicates: ['a', 'b', 'c']
        }, { type: 'FETCH_STOP_TIMER' }))
            .toEqual({
                ...emptyState,
                captorPredicates: ['a', 'b', 'c'],
            })
    })

    it('should not change anything upon empty data list received', () => {
        expect(dataReducer(undefined, {
            type: 'RECEIVED_HITS',
            data: { hits: [] },
            timestamp: new Date(),
        }))
            .toEqual(emptyState)
    })

    it('should process hit received', () => {
        const hits = [{ _id: "1", _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } }]
        expect(dataReducer({ ...emptyState }, {
            type: 'RECEIVED_HITS',
            data: { hits },
            config: testConfig,
            timestamp: new Date(),
        }))
            .toEqual({
                ...emptyState,
                data: {
                    ...emptyState.data,
                    knownIds: { "1": 1 },
                    hits: [toLogHit(hits[0])],
                },
            })
    })

    it('should skip hit known', () => {
        const hits = [{ _id: "1", _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } }]
        let initialState = { ...emptyState, data: { ...emptyState.data, knownIds: { "1": 1 } } }
        expect(dataReducer(initialState, {
            type: 'RECEIVED_HITS',
            data: { hits },
            config: testConfig,
            timestamp: new Date(),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [],
                },
            })
    })

    it('should capture what belongs to captor', () => {
        const hits = [{ _id: "1", _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } }]
        let initialState = { ...emptyState, captorPredicates: [captorForMessage('m', 'm')] }
        expect(dataReducer(initialState, {
            type: 'RECEIVED_HITS',
            data: { hits },
            config: testConfig,
            timestamp: new Date(),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    knownIds: { "1": 1 },
                    captures: { 'm': [toLogHit(hits[0])] }
                },
            })
    })

    it('captor with message replacement alters the message', () => {
        const hits = [{ _id: "1", _source: { message: 'm', timestamp: 1, otherField: 'other value' } }]
        let captor = captorToPredicate(messageExtractor(messageContainsCaptor('m', 'm'), 'otherField'))
        let initialState = { ...emptyState, captorPredicates: [captor] }
        expect(dataReducer(initialState, {
            type: 'RECEIVED_HITS',
            data: { hits },
            config: testConfig,
            timestamp: new Date(),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    knownIds: { "1": 1 },
                    hits: [],
                    captures: { 'm': [{...toLogHit(hits[0]), message: 'other value'}] }
                },
            })
    })

    it('captor with acknowledge false leaves line in the hits but adds a tag', () => {
        const hits = [{ _id: "1", _source: { message: 'm', timestamp: 1} }]
        let captor = captorToPredicate({...messageExtractor(messageContainsCaptor('m', 'm'), 'otherField'), acknowledge: false})
        let initialState = { ...emptyState, captorPredicates: [captor] }
        let expectedLogHit = {...toLogHit(hits[0]), tags: ["m"]}
        expect(dataReducer(initialState, {
            type: 'RECEIVED_HITS',
            data: { hits },
            config: testConfig,
            timestamp: new Date(),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    knownIds: { "1": 1 },
                    hits: [expectedLogHit],
                    captures: {"m": [expectedLogHit]}
                },
            })
    })

    it('should survive failing captor', () => {
        let capturedErrors = captureConsoleError(() => {
            const hits = [{ _id: "1" }]
            let failingCaptor = {
                captor: messageContainsCaptor('bad', 'very bad'),
                predicate: () => {throw Error('always failing')}
            }
            let initialState = { ...emptyState, captorPredicates: [failingCaptor] }
            let reduced = dataReducer(initialState, {
                type: 'RECEIVED_HITS',
                data: { hits },
                config: testConfig,
                timestamp: new Date(),
            });
            expect(reduced.data.hits)
                .toEqual([toLogHit(hits[0])])
        })
        expect(capturedErrors.length).toEqual(1)
    })

    it('extend existing captures', () => {
        const hits = [{ _id: "1", _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } },
        { _id: "2", _source: { message: 'm', timestamp: "2017-08-30T09:12:05.216Z" } }]
        let initialState = {
            ...emptyState,
            captorPredicates: [captorForMessage('m', 'm')],
            data: {
                ...emptyState.data,
                captures: { 'm': [toLogHit(hits[0])] },
                knownIds: { "1": 1 }
            }
        }
        expect(dataReducer(initialState, {
            type: 'RECEIVED_HITS',
            data: { hits },
            config: testConfig,
            timestamp: new Date(),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    knownIds: { "1": 1, "2": 1 },
                    captures: { 'm': [toLogHit(hits[0]), toLogHit(hits[1])] }
                },
            })
    })

    it('shall not let unrelated captor', () => {
        const hits = [{ _id: "1", _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } }]
        let initialState = { ...emptyState, captorPredicates: [captorForMessage('something else', 'a')] }
        expect(dataReducer(initialState, {
            type: 'RECEIVED_HITS',
            data: { hits },
            config: testConfig,
            timestamp: new Date(),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    knownIds: { "1": 1 },
                    hits: [toLogHit(hits[0])]
                },
            })
    })

    it('shall ack all', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2 } },
            { _id: "3", _source: { timestamp: 3 } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[0]),
                    toLogHit(hits[1]),
                    toLogHit(hits[2]),
                ],
                knownIds: { "1": 1, "2": 1, "3": 1 },
            }
        }
        expect(dataReducer(initialState, {
            type: 'ACK_ALL',
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [],
                    acked: [
                        toLogHit(hits[0]),
                        toLogHit(hits[1]),
                        toLogHit(hits[2]),
                    ],
                }
            })
    })

    it('shall ack till id', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2 } },
            { _id: "3", _source: { timestamp: 3 } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[0]),
                    toLogHit(hits[1]),
                    toLogHit(hits[2]),
                ],
                knownIds: { "1": 1, "2": 1, "3": 1 },
            }
        }
        expect(dataReducer(initialState, {
            type: 'ACK_TILL_ID',
            id: '2',
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [toLogHit(hits[2])],
                    acked: [                    
                        toLogHit(hits[0]),
                        toLogHit(hits[1]),
                    ],
                }
            })
    })

    it('shall ack id', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2 } },
            { _id: "3", _source: { timestamp: 3 } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[0]),
                    toLogHit(hits[1]),
                    toLogHit(hits[2]),
                ],
            }
        }
        expect(dataReducer(initialState, {
            type: 'ACK_ID',
            id: '2',
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [
                        toLogHit(hits[0]),
                        toLogHit(hits[2]),
                    ],
                    acked: [toLogHit(hits[1])],
                }
            })
    })

    it('shall move marked separate place', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2 } },
            { _id: "3", _source: { timestamp: 3 } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[0]),
                    toLogHit(hits[1]),
                    toLogHit(hits[2]),
                ],
            }
        }
        expect(dataReducer(initialState, {
            type: 'MARK_HIT',
            payload: {
                id: '2',
            }
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [
                        toLogHit(hits[0]),
                        toLogHit(hits[2]),
                    ],
                    marked: [toLogHit(hits[1])]
                }
            })
    })

    it('shall move marked back tot he list. Can be simply prepending. for now', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2 } },
            { _id: "3", _source: { timestamp: 3 } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[0]),
                ],
                marked: [
                    toLogHit(hits[1]),
                    toLogHit(hits[2]),
                ]
            }
        }
        expect(dataReducer(initialState, {
            type: 'UNMARK_HIT',
            payload: {
                id: '2',
            }
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [
                        toLogHit(hits[1]),
                        toLogHit(hits[0]),
                    ],
                    marked: [toLogHit(hits[2])]
                }
            })
    })

    it('moves hits to capture upon captor addition', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2, message: "catch() me" } },
            { _id: "3", _source: { timestamp: 3, message: "leave me" } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[1]),
                    toLogHit(hits[2]),
                ],
                captures: {
                    'old': [toLogHit(hits[0])],
                }
            }
        }
        expect(dataReducer(initialState, {
            type: 'ADD_CAPTOR',
            captor: messageContainsCaptor("new", "catch("),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [
                        toLogHit(hits[2])
                    ],
                    captures: {
                        'old': [toLogHit(hits[0])],
                        'new': [toLogHit(hits[1])],
                    }
                }
            })
    })

    it('updates the messages upon captor addition', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1, message: "blah", alternative: "alternativeText" } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[0]),
                ],
            }
        }
        let expectedMessage = {...toLogHit(hits[0]), message: "alternativeText", tags: ["new"]}
        expect(dataReducer(initialState, {
            type: 'ADD_CAPTOR',
            captor: messageExtractor(keepPending(messageContainsCaptor("new", "alt", "alternative")), "alternative"),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [
                        expectedMessage,
                    ],
                    captures: {
                        "new": [expectedMessage]
                    }
                }
            })
    })

    it('moves hits to capture upon regexp captor addition', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2, message: "catch 123 me" } },
            { _id: "3", _source: { timestamp: 3, message: "don't cajtch me" } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[1]),
                    toLogHit(hits[2]),
                ],
                captures: {
                    'old': [toLogHit(hits[0])],
                }
            }
        }
        expect(dataReducer(initialState, {
            type: 'ADD_CAPTOR',
            captor: messageMatchesRegexCaptor("new", "catch \\d+"),
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [
                        toLogHit(hits[2])
                    ],
                    captures: {
                        'new': [toLogHit(hits[1])],
                        'old': [toLogHit(hits[0])],
                    }
                }
            })
    })

    it('forgets the captures upon captor removal', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2 } },
            { _id: "3", _source: { timestamp: 3 } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[2]),
                ],
                captures: {
                    'cap1': [toLogHit(hits[0])],
                    'cap2': [toLogHit(hits[1])],
                }
            }
        }
        expect(dataReducer(initialState, {
            type: 'REMOVE_CAPTOR',
            captorKey: 'cap2',
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [
                        toLogHit(hits[1]),
                        toLogHit(hits[2]),
                    ],
                    captures: {
                        'cap1': [toLogHit(hits[0])],
                    }
                }
            })
    })

});