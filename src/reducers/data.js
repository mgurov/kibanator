import _ from 'lodash'
import LogHit from '../domain/LogHit'
import update from 'immutability-helper';
import {captorToPredicate} from '../domain/Captor'

export const emptyState = {
  isFetching: false, 
  data: {
    knownIds: {}, 
    hits: [], 
    captures: {},
    acked: {count: 0, lastTimestamp: null}
  },
  error: null,
  lastSync: null,
  captorPredicates: [], //hackishly copied here upon config update. see captorPredicatesUpdater
}

const data = (state = emptyState, action) => {
  switch (action.type) {
    case 'FETCHING_DATA':
      return Object.assign({}, state, {isFetching: true})
    case 'FAILED_FETCHING_DATA':
      return Object.assign({}, state, {isFetching: false, error: action.error})
    case 'FETCH_STOP_TIMER' : //reset all
      return {...emptyState, captorPredicates: state.captorPredicates}
    case 'RECEIVED_HITS':
      let newState = {
        isFetching: false, 
        error: null,
        lastSync: action.timestamp,
      }
      let mergeParams = {newHitsTransformer: h => LogHit(h, action.config), captorPredicates: state.captorPredicates}
      let newHits = selectNewHits(action.data.hits, state.data.knownIds, mergeParams)
      if (!newHits) {
        return Object.assign({}, state, newState)
      }
      let captures = _.mergeWith(_.clone(state.data.captures), newHits.captures, (a, b) => (a||[]).concat(b||[]))
      let hits = state.data.hits.concat(newHits.hits)
      let knownIds = {...state.data.knownIds, ...newHits.knownIds}
      newState.data = Object.assign({}, state.data, {hits, knownIds,  captures})
      return Object.assign({}, state, newState)
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
    case 'ADD_CAPTOR' : 
      let [captured, remaining] = _.partition(state.data.hits, captorToPredicate(action.captor).predicate)
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

function selectNewHits(receivedHits, previouslyKnownIds, {newHitsTransformer = _.identity, captorPredicates = []} = {}) {
  let captures = {}
  let hits = []
  let knownIds = {}

  _.forEach(receivedHits, h => {
    if (previouslyKnownIds[h._id] || knownIds[h._id]) {
      return
    }
    knownIds[h._id] = 1
    let newHit = newHitsTransformer(h)

    for (var i = 0; i < captorPredicates.length; i++) {
      let p = captorPredicates[i]
      if (p.predicate(newHit)) {
        if (!captures[p.key]) {
          captures[p.key] = []
        }
        captures[p.key].push(newHit)
        return //hit processing, do not want it to be pushed to the main hits 
      }
    }
    hits.push(newHit)
  })
  if (knownIds.length === 0) {
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

export default data