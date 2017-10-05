import dataReducer, { emptyState } from './data'
import _ from 'lodash'
import LogHit from '../domain/LogHit'
import { messageContainsCaptor, captorToPredicate, messageMatchesRegexCaptor } from '../domain/Captor'

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
    it('set isFetching', () => {
        expect(dataReducer(emptyState, { type: 'FETCHING_DATA' }))
            .toHaveProperty('fetchStatus.isFetching', true)
    })
    it('Error set upon error', () => {
        expect(dataReducer({ ...emptyState, fetchStatus: { isFetching: true } }, { type: 'FAILED_FETCHING_DATA', error: 'Error' }))
            .toHaveProperty('fetchStatus', {
                isFetching: false,
                error: 'Error',
            })
    })
    it('should reset isFetching and last sync upon empty data list received', () => {
        expect(dataReducer({ ...emptyState, fetchStatus: { ...emptyState.fetchStatus, isFetching: true } }, {
            type: 'RECEIVED_HITS',
            data: { hits: [] },
            timestamp: new Date(),
        }))
            .toEqual({
                ...emptyState,
                fetchStatus: {
                    ...emptyState.fetchStatus,
                    isFetching: false,
                    lastSync: expect.any(Date),
                }
            })
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
                fetchStatus: {
                    ...emptyState.fetchStatus,
                    lastSync: expect.any(Date),
                }
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
                fetchStatus: {
                    ...emptyState.fetchStatus,
                    lastSync: expect.any(Date),
                }
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
                fetchStatus: {
                    ...emptyState.fetchStatus,
                    lastSync: expect.any(Date),
                }
            })
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
                fetchStatus: {
                    ...emptyState.fetchStatus,
                    lastSync: expect.any(Date),
                }
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
                fetchStatus: {
                    ...emptyState.fetchStatus,
                    lastSync: expect.any(Date),
                }
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