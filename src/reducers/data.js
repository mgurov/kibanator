import _ from 'lodash'

const emptyState = {
  isFetching: false, 
  data: {
    knownIds: {}, 
    hits: [], 
    acked: {count: 0, lastTimestamp: null}
  },
  error: null,
  lastSync: null,
}

const data = (state = emptyState, action) => {
  switch (action.type) {
    case 'FETCHING_DATA':
      return Object.assign({}, state, {isFetching: true})
    case 'RECEIVED_HITS':
      return Object.assign({}, state, {
        isFetching: false, 
        data: mergeHits(action.data.hits, state.data), 
        error: null,
        lastSync: new Date(),
      })
    case 'FAILED_FETCHING_DATA':
      return Object.assign({}, state, {isFetching: false, error: action.error})
    case 'REMOVE_TILL_TICK_ID':
      let removeUpToIndex = _.findIndex(state.data.hits, ['_id', action.id])
      if (removeUpToIndex >= 0) {
        let startFromIndex = removeUpToIndex + 1
        let acked = {
          count : state.data.acked.count + removeUpToIndex + 1,
          lastTimestamp : state.data.hits[removeUpToIndex]._source.Timestamp
        }
        return Object.assign({}, state, {
          data : Object.assign({}, state.data, {
            hits: state.data.hits.slice(startFromIndex),
            acked
          })
        })
      } else {
        console.error('Could not find id to delete to: ', action.id, data)
        return state
      }
    case 'FETCH_STOP_TIMER' : 
      return emptyState
    default:
      return state
  }
}

function mergeHits(hits, originalData) {
  let needClone = true
  let result = originalData
  _.forEach(hits, h => {
    if (result.knownIds[h._id]) {
      return
    }
    if (needClone) {
      result = _.cloneDeep(result)
      needClone = false
    }
    result.knownIds[h._id] = 1
    result.hits.push(h)
  })
  return result
}

export {mergeHits}

export default data