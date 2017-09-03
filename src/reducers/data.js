import _ from 'lodash'
import LogHit from '../domain/LogHit'

const emptyState = {
  isFetching: false, 
  data: {
    knownIds: {}, 
    hits: [], 
    hitStats: {
      count: 0,
      firstTimestamp: null,
      lastTimestamp: null,
    },
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
      let newState = {
        isFetching: false, 
        error: null,
        lastSync: new Date(),
      }
      let mergedHits = mergeHits(action.data.hits, state.data, h => new LogHit(h, action.config))
      if (!mergedHits) {
        return Object.assign({}, state, newState)
      }
      let {hits, knownIds} = mergedHits

      let hitStats = {count: hits.length}
      if (hitStats.count > 0) {
        hitStats.firstTimestamp = hits[0].getTimestamp()
        hitStats.lastTimestamp = hits[hits.length - 1].getTimestamp()
      }
      newState.data = Object.assign({}, state.data, {hits, knownIds, hitStats})
      return Object.assign({}, state, newState)
    case 'FAILED_FETCHING_DATA':
      return Object.assign({}, state, {isFetching: false, error: action.error})
    case 'REMOVE_TILL_TICK_ID':
      let removeUpToIndex = _.findIndex(state.data.hits, ['id', action.id])
      if (removeUpToIndex >= 0) {
        let startFromIndex = removeUpToIndex + 1
        let acked = {
          count : state.data.acked.count + removeUpToIndex + 1,
          lastTimestamp : state.data.hits[removeUpToIndex].getTimestamp(),
          firstTimestamp : state.data.acked.firstTimestamp || state.data.hits[0].getTimestamp(),
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

function mergeHits(newHits, {hits, knownIds}, newHitsTransformer = _.identity) {
  let needClone = true
  let changed = false
  _.forEach(newHits, h => {
    if (knownIds[h._id]) {
      return
    }
    if (needClone) {
      hits = _.cloneDeep(hits)
      knownIds = _.cloneDeep(knownIds)
      needClone = false
      changed = true
    }
    knownIds[h._id] = 1
    hits.push(newHitsTransformer(h))
  })
  if (!changed) {
    return null
  } else {
    return {knownIds, hits}
  }
}

export {mergeHits}

export default data