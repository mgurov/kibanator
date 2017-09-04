import _ from 'lodash'
import LogHit from '../domain/LogHit'
import update from 'immutability-helper';

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
      let mergedHits = mergeHits(action.data.hits, state.data, h => LogHit(h, action.config))
      if (!mergedHits) {
        return Object.assign({}, state, newState)
      }
      let {hits, knownIds} = mergedHits
      let hitStats = collectHitStats(hits)
      newState.data = Object.assign({}, state.data, {hits, knownIds, hitStats})
      return Object.assign({}, state, newState)
    case 'FAILED_FETCHING_DATA':
      return Object.assign({}, state, {isFetching: false, error: action.error})
    case 'REMOVE_TILL_TICK_ID':
      let removeUpToIndex = _.findIndex(state.data.hits, ['id', action.id])
      if (removeUpToIndex >= 0) {
        let hits = _.filter(state.data.hits, ({favorite}, index) => {return favorite || index > removeUpToIndex})
        //NB: times aren't entirely correct now for the favorites
        let acked = {
          count : state.data.acked.count + state.data.hits.length - hits.length,
          lastTimestamp : state.data.hits[removeUpToIndex].timestamp,
          firstTimestamp : state.data.acked.firstTimestamp || state.data.hits[0].timestamp,
        }
        let hitStats = collectHitStats(hits)
        return Object.assign({}, state, {
          data : Object.assign({}, state.data, {
            hits,
            acked,
            hitStats
          })
        })
      } else {
        console.error('Could not find id to delete to: ', action.id, data)
        return state
      }
    case 'TOGGLE_FAVORITE_ID' :
      let theIndex = _.findIndex(state.data.hits, ['id', action.id])
      if (theIndex < 0) {
        console.error('Could not find id to delete to: ', action.id, data)
        return state
      }
      let originalItem = state.data.hits[theIndex]
      let alteredItem = Object.assign({}, originalItem, {favorite: !originalItem.favorite})
      return update(state, {
        data :{hits: {[theIndex]: {$set: alteredItem}}}
      })
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

function collectHitStats(hits) {
  let result = {count: hits.length}
  if (result.count > 0) {
    result.firstTimestamp = hits[0].timestamp
    result.lastTimestamp = hits[hits.length - 1].timestamp
  }
  return result
}

export {mergeHits}

export default data