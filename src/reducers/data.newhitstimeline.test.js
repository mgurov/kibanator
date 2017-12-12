import dataReducer, {
    emptyState,
    reprocessTimeline
} from './data'
import LogHit from '../domain/LogHit'
import {
    messageContainsCaptor,
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
                'pending': {records: [{
                    id: "1",
                    source: hits.byId["1"],
                }],
                moreToShow: 0,
            },
            }
        )
})

test('only the N first should be copied', () => {

    const hits = {
        byId: {},
        ids: [],
    }

    for (let i = 0; i < 10000; i++) {
        let id = i + ""
        hits[id] = toLogHit({
            _id: id,
            _source: {
                message: 'm',
                timestamp: "2017-08-30T09:12:04.216Z"
            }
        })
        hits.ids.push(id)
    }

    let actual = reprocessTimeline({
        hits
    }).pending

    expect(actual.records.length)
        .toEqual(constant.VIEW_SIZE)

    expect(actual.moreToShow)
        .toEqual(10000 - constant.VIEW_SIZE)
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
            'captures.m': {
                moreToShow: 0,
                records: [{
                    id: "1",
                    source: hits.byId["1"],
                }],
            },
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
            pending: {
                records: [{
                    id: "2",
                    source: hits.byId["2"],
                }],
                moreToShow: 0,
            },
            acked: {
                records: [{
                    id: "1",
                    source: hits.byId["1"],
                }],
                moreToShow: 0,
            },
        }

        )

})