import dataReducer, { emptyState } from './data'
import LogHit from '../domain/LogHit'

const testConfig = {
    timeField: 'timestamp',
    messageField: 'message'
}

const toLogHit = (h) => LogHit(h, testConfig)

const captorForMessage = (key, messageSub) => captorToPredicate(messageContainsCaptor(key, messageSub))

test('should detect new hits', () => {
    const hits = [{ _id: "1", _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } }]
    expect(dataReducer(emptyState, {
        type: 'TMP_INCOMING_HITS',
        payload: {
            hits,
            config: testConfig,
        },
    }))
    .toEqual({
        ...emptyState,
        hits: {
            byId: {
                "1" : toLogHit(hits[0]),
            },
            newIds: ["1"],
            ids: ["1"],
        }
    })
})

test('should skip known hits', () => {
    const hits = [{ _id: "1", _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } }]
    let initialState = {
        ...emptyState,
        hits: {
            byId: {
                "1" : toLogHit(hits[0]),
            },
            newIds: [],
            ids: ["1"],
        }
    }
    expect(dataReducer(initialState, {
        type: 'TMP_INCOMING_HITS',
        payload: {
            hits,
            config: testConfig,
        },
    }))
    .toEqual(initialState)
})

test('should append new hits to the existing ones', () => {
    const hits = [
        { _id: "1", _source: { message: 'm1', timestamp: "2017-08-30T09:12:04.216Z" } },
        { _id: "2", _source: { message: 'm2', timestamp: "2017-08-30T09:12:04.216Z" } },
    ]
    let initialState = {
        ...emptyState,
        hits: {
            ...emptyState.hits,
            byId: {
                "1" : toLogHit(hits[0]),
            },
            newIds: [],
            ids: ["1"],
        }
    }
    expect(dataReducer(initialState, {
        type: 'TMP_INCOMING_HITS',
        payload: {
            hits,
            config: testConfig,
        },
    }))
    .toEqual(
        {
            ...initialState,
            hits: {
                byId: {
                    "1" : toLogHit(hits[0]),
                    "2" : toLogHit(hits[1]),
                },
                newIds: ["2"],
                ids: ["1", "2"],
            }
        }
    )
})

test('should keep the time-based order when adding', () => {
    const hits = {
        "1": { _id: "1", _source: { message: 'm1', timestamp: "2017-08-30T00:00:00.000Z" } },
        "2": { _id: "2", _source: { message: 'm2', timestamp: "2017-08-30T00:00:01.000Z" } },
        "3": { _id: "3", _source: { message: 'm3', timestamp: "2017-08-30T00:00:02.000Z" } },
    }
    let initialState = {
        ...emptyState,
        hits: {
            ...emptyState.hits,
            byId: {
                "1" : toLogHit(hits["1"]),
                "3" : toLogHit(hits["3"]),
            },
            newIds: [],
            ids: ["1", "3"],
        }
    }
    expect(dataReducer(initialState, {
        type: 'TMP_INCOMING_HITS',
        payload: {
            hits: [hits["2"]],
            config: testConfig,
        },
    }))
    .toEqual(
        {
            ...initialState,
            hits: {
                byId: {
                    "1" : toLogHit(hits["1"]),
                    "2" : toLogHit(hits["2"]),
                    "3" : toLogHit(hits["3"]),
                },
                newIds: ["2"],
                ids: ["1", "2", "3"],
            }
        }
    )
})

test('should ack hit', () => {
    const hits = [
        { _id: "1", _source: { message: 'm1', timestamp: "2017-08-30T09:12:04.216Z" } },
        { _id: "2", _source: { message: 'm2', timestamp: "2017-08-30T09:12:04.216Z" } },
    ]
    let initialState = {
        ...emptyState,
        hits: {
            ...emptyState.hits,
            byId: {
                "1" : toLogHit(hits[0]),
                "2" : toLogHit(hits[1]),
            },
            newIds: [],
            ids: ["1", "2"],
        }
    }
    expect(dataReducer(initialState, {
        type: 'ACK_ID',
        id: "1"
    }))
    .toEqual(
        {
            ...initialState,
            acked: {"1": true}
        }
    )
})
