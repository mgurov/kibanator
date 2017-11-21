import dataReducer, { emptyState, reprocessTimeline } from './data'
import LogHit from '../domain/LogHit'

const testConfig = {
    timeField: 'timestamp',
    messageField: 'message'
}

const toLogHit = (h) => LogHit(h, testConfig)

const captorForMessage = (key, messageSub) => captorToPredicate(messageContainsCaptor(key, messageSub))

test('just copy the bloody data', () => {
  const hits = {
      byId: {"1": toLogHit({ _id: "1", _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } })},
      ids: ["1"]
  }

  expect(reprocessTimeline(hits, []))
    .toEqual(
        [
            {
                source: hits.byId["1"]
            }
        ]
    )

})

test('only the 100 first should be copied', () => {

    const hits = {
        byId: {},
        ids: [],
    }

  for (let i = 0; i < 1000; i++) {
    let id = i + ""
    hits[id] = toLogHit({ _id: id, _source: { message: 'm', timestamp: "2017-08-30T09:12:04.216Z" } }) 
    hits.ids.push(id)
  }

  expect(reprocessTimeline(hits, []).length)
    .toEqual(10)

})