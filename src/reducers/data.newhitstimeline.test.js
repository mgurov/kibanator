import {
    reprocessTimeline
} from './data'
import LogHit from '../domain/LogHit'
import {
    messageContainsCaptor,
    keepPending,
    messageExtractor,
    captorToPredicate
} from '../domain/Captor'

const testConfig = {
    timeField: 'timestamp',
    messageField: 'message'
}

const toLogHit = (h) => LogHit(h, testConfig)

function applicablePredicates( predicates ) {
    return predicates.map( captorToPredicate )
}

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
                    tags: [],
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
        captorPredicates: applicablePredicates([messageContainsCaptor('m', 'm')])
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
        captorPredicates: applicablePredicates([keepPending(messageContainsCaptor('m', 'm'))])
    }))
        .toEqual(
        {
            'pending': [{
                    id: "1",
                    source: hits.byId["1"],
                    tags: ['m'],
                }],
            'captures.m': [{
                    id: "1",
                    source: hits.byId["1"],
                }]
        }
        )
})

test('transform non-acking field', () => {
    const hits = {
        byId: {
            "1": toLogHit({
                _id: "1",
                _source: {
                    message: 'm',
                    timestamp: "2017-08-30T09:12:04.216Z",
                    anotherField: 'show me',
                }
            })
        },
        ids: ["1"]
    }

    let captorPredicate = messageExtractor(keepPending(messageContainsCaptor('m', 'm')), 'anotherField')
    expect(reprocessTimeline({
        hits,
        captorPredicates: applicablePredicates([captorPredicate])
    }))
        .toEqual(
        {
            'pending': [{
                    id: "1",
                    source: hits.byId["1"],
                    tags: ['m'],
                    message: 'show me',
                }],
            'captures.m': [{
                    id: "1",
                    source: hits.byId["1"],
                    message: 'show me',
                }]
        }
        )
})

test('multi tag non-acking captures', () => {
    const hits = {
        byId: {
            "1": toLogHit({
                _id: "1",
                _source: {
                    message: 'm',
                    anotherField: 'f',
                    timestamp: "2017-08-30T09:12:04.216Z"
                }
            })
        },
        ids: ["1"]
    }

    expect(reprocessTimeline({
        hits,
        captorPredicates: applicablePredicates([
            keepPending(messageContainsCaptor('m', 'm')),
            keepPending(messageContainsCaptor('f', 'f', 'anotherField')),
        ])
    }))
        .toEqual(
        {
            'pending': [{
                    id: "1",
                    source: hits.byId["1"],
                    tags: ['m', 'f'],
                }],
            'captures.m': [{
                    id: "1",
                    source: hits.byId["1"],
                }],
            'captures.f': [{
                    id: "1",
                    source: hits.byId["1"],
                }]
        }
        )
})

test('ack if any of the captures is acking', () => {
    const hits = {
        byId: {
            "1": toLogHit({
                _id: "1",
                _source: {
                    message: 'm',
                    anotherField: 'f',
                    timestamp: "2017-08-30T09:12:04.216Z"
                }
            })
        },
        ids: ["1"]
    }

    expect(reprocessTimeline({
        hits,
        captorPredicates: applicablePredicates([
            keepPending(messageContainsCaptor('m', 'm')),
            messageContainsCaptor('f', 'f', 'anotherField'),
        ])
    }))
        .toEqual(
        {
            'captures.m': [{
                    id: "1",
                    source: hits.byId["1"],
                }],
            'captures.f': [{
                    id: "1",
                    source: hits.byId["1"],
                }]
        }
        )
})

test('use own transformation for captor and first one for the pending list', () => {
    const hits = {
        byId: {
            "1": toLogHit({
                _id: "1",
                _source: {
                    message: 'm',
                    anotherField: 'f',
                    timestamp: "2017-08-30T09:12:04.216Z"
                }
            })
        },
        ids: ["1"]
    }

    expect(reprocessTimeline({
        hits,
        captorPredicates: applicablePredicates([
            messageExtractor(keepPending(messageContainsCaptor('m', 'm')), 'message'),
            messageExtractor(keepPending(messageContainsCaptor('f', 'f', 'anotherField')), 'anotherField'),
        ])
    }))
        .toEqual(
        {
            'pending': [{
                id: "1",
                source: hits.byId["1"],
                tags: ['m', 'f'],
                message: 'm',
            }],
            'captures.m': [{
                    id: "1",
                    source: hits.byId["1"],
                    message: 'm',
                }],
            'captures.f': [{
                    id: "1",
                    source: hits.byId["1"],
                    message: 'f',
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
                    tags: [],
                }],
            acked: [{
                    id: "1",
                    source: hits.byId["1"],
                }],
        }

        )

})