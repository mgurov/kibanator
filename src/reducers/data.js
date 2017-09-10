import _ from 'lodash'
import LogHit from '../domain/LogHit'
import update from 'immutability-helper';
import {captorToPredicate} from '../domain/Captor'

const emptyState = {
  isFetching: false, 
  data: {
    knownIds: {}, 
    hits: [], 
    captures: {},
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
      let mergeParams = {newHitsTransformer: h => LogHit(h, action.config), captors: action.captors || {}}
      let mergedHits = mergeHits(action.data.hits, state.data, mergeParams)
      if (!mergedHits) {
        return Object.assign({}, state, newState)
      }
      let {hits, knownIds, captures: newCaptures} = mergedHits
      let captures = _.mergeWith(_.clone(state.data.captures), newCaptures, (a, b) => (a||[]).concat(b||[]))
      newState.data = Object.assign({}, state.data, {hits, knownIds,  captures})
      return Object.assign({}, state, newState)
    case 'FAILED_FETCHING_DATA':
      return Object.assign({}, state, {isFetching: false, error: action.error})
    case 'ACK_ALL' :
      return Object.assign({}, state, {
        data : Object.assign({}, state.data, removeNonFavoriteAfterIndex(state.data, state.data.hits.length - 1))
      })
    case 'ACK_TILL_ID':
      let removeUpToIndex = _.findIndex(state.data.hits, ['id', action.id])
      if (removeUpToIndex < 0) {
        console.error('Could not find id to delete to: ', action.id, data)
        return state
      }
      return Object.assign({}, state, {
        data : Object.assign({}, state.data, removeNonFavoriteAfterIndex(state.data, removeUpToIndex))
      })
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
      console.log('would return', emptyState)
      return emptyState
    case 'ADD_CAPTOR' : 
      //TODO: need to recalc the stats.
      let [captured, remaining] = _.partition(state.data.hits, captorToPredicate(action.captor))
      if (_.isEmpty(captured)) {
        return state;
      }
      return update(state, {data :{hits: {$set: remaining}, captures: {[action.captor.key]: {$set: captured}}}})
    case 'REMOVE_CAPTOR': 
      return update(state, {data :{captures: {$unset: [action.captorKey]}}})
    default:
      return state
  }
}

function mergeHits(newHits, {hits, knownIds}, {newHitsTransformer = _.identity, captors = {}} = {}) {
  //TODO: I do not actually need the initial hits, those could've been merged outside.
  let needClone = true
  let changed = false
  let captures = {}

  let captorPredicates = _.map(captors, c => { let p = captorToPredicate(c); p.key = c.key; return p} )

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
    let newHit = newHitsTransformer(h)

    for (var i = 0; i < captors.length; i++) {
      let p = captorPredicates[i]
      if (p(newHit)) {
        if (!captures[p.key]) {
          captures[p.key] = []
        }
        captures[p.key].push(newHit)
        return //hit processing, do not want it to be pushed to the main hits 
      }
    }
    hits.push(newHit)
  })
  if (!changed) {
    return null
  } else {
    return {knownIds, hits, captures}
  }
}

function removeNonFavoriteAfterIndex({hits:originalHits, acked:originalAck}, removeUpToIndex) {
  let hits = _.filter(originalHits, ({favorite}, index) => {return favorite || index > removeUpToIndex})
  //NB: times aren't entirely correct now for the favorites
  let acked = {
      count : originalAck.count + originalHits.length - hits.length,
      lastTimestamp : originalHits[removeUpToIndex].timestamp,
      firstTimestamp : originalAck.firstTimestamp || originalHits[0].timestamp,
    }
    return {
      hits,
      acked,
    }
}

export {mergeHits}

export default data