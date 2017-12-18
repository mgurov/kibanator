import dataReducer, {
    emptyState,
    reprocessTimeline
} from './data'
import LogHit from '../domain/LogHit'
import {
    messageContainsCaptor,
    keepPending,
    captorToPredicate
} from '../domain/Captor'
import * as constant from '../constant'

const testConfig = {
    timeField: 'timestamp',
    messageField: 'message'
}

const toLogHit = (h) => LogHit(h, testConfig)

const captorForMessage = (key, messageSub) => captorToPredicate(messageContainsCaptor(key, messageSub))

test('just copy the bloody data', () => {
    const hits = {
        byId: {
            "1": toLogHit({
                _id: "1",
                _source: {
                    message: 'm',
                    timestamp: "2017-08-30T09:12:04.216Z"
                }
            })
        },
        ids: ["1"]
    }

    expect(reprocessTimeline({
            hits
        }))
        .toEqual({
                'pending': [{
                    id: "1",
                    source: hits.byId["1"],
                }],
            }
        )
})

test('record captured', () => {
    const hits = {
        byId: {
            "1": toLogHit({
                _id: "1",
                _source: {
                    message: 'm',
                    timestamp: "2017-08-30T09:12:04.216Z"
                }
            })
        },
        ids: ["1"]
    }

    expect(reprocessTimeline({
        hits,
        captorPredicates: [captorForMessage('m', 'm')]
    }))
        .toEqual(
        {
            'captures.m': [{
                    id: "1",
                    source: hits.byId["1"],
                }]
        }
        )

})

test('keep non-acking capture in the pending list', () => {
    const hits = {
        byId: {
            "1": toLogHit({
                _id: "1",
                _source: {
                    message: 'm',
                    timestamp: "2017-08-30T09:12:04.216Z"
                }
            })
        },
        ids: ["1"]
    }

    expect(reprocessTimeline({
        hits,
        captorPredicates: [keepPending(captorForMessage('m', 'm'))]
    }))
        .toEqual(
        {
            'pending': [{
                    id: "1",
                    source: hits.byId["1"],
                }],
            'captures.m': [{
                    id: "1",
                    source: hits.byId["1"],
                }]
        }
        )
})

test('skip acked', () => {
    const hits = {
        byId: {
            "1": toLogHit({
                _id: "1",
                _source: {
                    message: 'm',
                    timestamp: "2017-08-30T09:12:04.216Z"
                }
            }),
            "2": toLogHit({
                _id: "2",
                _source: {
                    message: 'm2',
                    timestamp: "2017-08-30T09:12:04.216Z"
                }
            }),
        },
        ids: ["1", "2"]
    }

    expect(reprocessTimeline({
        hits,
        acked: {
            "1": true
        }
    }))
        .toEqual(
        {
            pending: [{
                    id: "2",
                    source: hits.byId["2"],
                }],
            acked: [{
                    id: "1",
                    source: hits.byId["1"],
                }],
        }

        )

})