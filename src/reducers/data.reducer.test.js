import dataReducer, { emptyState } from './data'
import _ from 'lodash'
import LogHit from '../domain/LogHit'
import { messageContainsCaptor, captorToPredicate } from '../domain/Captor'

const testConfig = {
    timeField: 'timestamp',
    messageField: 'message'
}

const toLogHit = (h) => LogHit(h, testConfig)

const captorForMessage = (key, messageSub) => captorToPredicate(messageContainsCaptor(key, messageSub))

const favorite = h => { h.favorite = true; return h }

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
            .toEqual({ ...emptyState, isFetching: true })
    })
    it('Error set upon error', () => {
        expect(dataReducer({ ...emptyState, isFetching: true }, { type: 'FAILED_FETCHING_DATA', error: 'Error' }))
            .toEqual({
                ...emptyState,
                isFetching: false,
                error: 'Error',
            })
    })
    it('should reset isFetching and last sync upon empty data list received', () => {
        expect(dataReducer({ ...emptyState, isFetching: true }, {
            type: 'RECEIVED_HITS',
            data: { hits: [] },
            timestamp: new Date(),
        }))
            .toEqual({
                ...emptyState,
                isFetching: false,
                lastSync: expect.any(Date)
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
                lastSync: expect.any(Date),
                data: {
                    ...emptyState.data,
                    knownIds: { "1": 1 },
                    hits: [toLogHit(hits[0])],
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
                lastSync: expect.any(Date),
                data: {
                    ...initialState.data,
                    hits: [],
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
                lastSync: expect.any(Date),
                data: {
                    ...initialState.data,
                    knownIds: { "1": 1 },
                    captures: { 'm': [toLogHit(hits[0])] }
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
                lastSync: expect.any(Date),
                data: {
                    ...initialState.data,
                    knownIds: { "1": 1, "2": 1 },
                    captures: { 'm': [toLogHit(hits[0]), toLogHit(hits[1])] }
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
                lastSync: expect.any(Date),
                data: {
                    ...initialState.data,
                    knownIds: { "1": 1 },
                    hits: [toLogHit(hits[0])]
                }
            })
    })

    it('shall ack all except favorite', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: {} },
            { _id: "3", _source: { timestamp: 3 } },
        ]

        let secondHitIsMarked = toLogHit(hits[1]);
        secondHitIsMarked.favorite = true;

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    toLogHit(hits[0]),
                    secondHitIsMarked,
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
                    hits: [secondHitIsMarked],
                    acked: { count: 2, firstTimestamp: 1, lastTimestamp: 3 },
                }
            })
    })

    it('shall ack till id except favorite', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } }, // <- favorite
            { _id: "2", _source: { timestamp: 2 } },
            { _id: "3", _source: { timestamp: 3 } },
        ]

        let initialState = {
            ...emptyState,
            data: {
                ...emptyState.data,
                hits: [
                    favorite(toLogHit(hits[0])),
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
                    hits: [favorite(toLogHit(hits[0])), toLogHit(hits[2])],
                    acked: {
                        count: 1,
                        firstTimestamp: 1,  // <- bug because we don't filter out favs
                        lastTimestamp: 2
                    },
                }
            })
    })

    it('shall mark as favorite', () => {
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
            type: 'TOGGLE_FAVORITE_ID',
            id: '2',
        }))
            .toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    hits: [
                        toLogHit(hits[0]),
                        favorite(toLogHit(hits[1])),
                        toLogHit(hits[2])
                    ],
                }
            })
    })

    it('moves hits to capture upon captor addition', () => {
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2, message: "catch me" } },
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
            captor: messageContainsCaptor("new", "catch"),
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
                        toLogHit(hits[2])
                    ],
                    captures: {
                        'cap1': [toLogHit(hits[0])],
                    }
                }
            })
    })

});