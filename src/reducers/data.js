import _ from 'lodash'
import LogHit from '../domain/LogHit'
import update from 'immutability-helper';
import { captorToPredicate } from '../domain/Captor'

export const emptyState = {
  data: {
    knownIds: {},
    hits: [],
    captures: {},
    marked: [],
    acked: [],
  },
  fetchStatus: {
    isFetching: false,
    error: null,
    lastSync: null,
  },
  captorPredicates: [], //hackishly copied here upon config update. see captorPredicatesUpdater
}

const data = (state = emptyState, action) => {
  switch (action.type) {
    case 'FETCHING_DATA':
      return update(state, { fetchStatus: { isFetching: { $set: true } } })
    case 'FAILED_FETCHING_DATA':
      return update(state, { fetchStatus: { isFetching: { $set: false }, error: { $set: action.error } } })
    case 'FETCH_STOP_TIMER': //reset all
      return { ...emptyState, captorPredicates: state.captorPredicates }
    case 'RECEIVED_HITS':
      let fetchStatus = {
        isFetching: false,
        error: null,
        lastSync: action.timestamp,
      }

      let idFilteringResult = takeNewHits(action.data.hits, state.data.knownIds)

      if (!idFilteringResult.knownIds) {
        return { ...state, fetchStatus } //no new stuff
      }

      let transformedHits = _.map(idFilteringResult.hits, h => LogHit(h, action.config))

      let newHits = processCaptures(transformedHits, state.captorPredicates)
      let newState = { fetchStatus }
      let captures = _.mergeWith(_.clone(state.data.captures), newHits.captures, (a, b) => (a || []).concat(b || []))
      let hits = state.data.hits.concat(newHits.hits)
      let knownIds = { ...state.data.knownIds, ...idFilteringResult.knownIds }
      newState.data = Object.assign({}, state.data, { hits, knownIds, captures })
      return Object.assign({}, state, newState)
    case 'ACK_ALL':
      return {
        ...state,
        data: {
          ...state.data,
          hits: [],
          acked: state.data.acked.concat(state.data.hits),
        }
      }
    case 'ACK_ID':
      {
        let [byId, hits] = _.partition(state.data.hits, ["id", action.id])
        return {
          ...state,
          data: {
            ...state.data,
            hits,
            acked: state.data.acked.concat(byId),
          }
        }
      }
    case 'ACK_TILL_ID':
      {
        let removeUntilId = (id) => {
          let stillLooking = true
          return (h) => {
            if (h.id === id) {
              stillLooking = false
              return true //exclude this
            } else {
              return stillLooking
            }
          }
        }
        let [acked, hits] = _.partition(state.data.hits, removeUntilId(action.id))
        return {
          ...state,
          data: {
            ...state.data,
            hits,
            acked: state.data.acked.concat(acked),
          }
        }
      }
    case 'MARK_HIT':
      {
        let [selected, rest] = _.partition(state.data.hits, ['id', action.payload.id])
        if (selected.length === 0) {
          console.error('Could not find id: ', action.payload.id)
          return state
        }
        return update(state, {
          data: { hits: { $set: rest }, marked: { $push: selected } }
        })
      }
    case 'UNMARK_HIT':
      {
        let [selected, rest] = _.partition(state.data.marked, ['id', action.payload.id])
        if (selected.length === 0) {
          console.error('Could not find id: ', action.payload.id)
          return state
        }
        return update(state, {
          data: { marked: { $set: rest }, hits: { $set: selected.concat(state.data.hits) } }
        })
      }
    case 'ADD_CAPTOR':
      {
        let newHits = processCaptures(state.data.hits, [captorToPredicate(action.captor)])

        if (!newHits.captures) {
          return state
        }

        return {
          ...state,
          data: {
            ...state.data,
            hits: newHits.hits,
            captures: { ...state.data.captures, ...newHits.captures }
          }
        }
      }
    case 'REMOVE_CAPTOR':
      //TODO: do not add twice upon removal non-ack captor
      {
        let hits = state.data.captures[action.captorKey].concat(state.data.hits)
        return update(state, { data: { captures: { $unset: [action.captorKey] }, hits: { $set: hits } } })
      }
    default:
      return state
  }
}

function takeNewHits(incomingHits, previouslyKnownIds) {
  let hits = []
  let knownIds = {}
  _.forEach(incomingHits, h => {
    let id = h._id
    if (previouslyKnownIds[id] || knownIds[id]) {
      return
    }
    knownIds[id] = 1
    hits.push(h)
  })

  return {
    hits, knownIds
  }
}

function processCaptures(receivedHits, captorPredicates) {
  let captures = {}
  let hits = []

  _.forEach(receivedHits, newHit => {
    for (var i = 0; i < captorPredicates.length; i++) {
      let p = captorPredicates[i]

      let matchedThisCaptor = false
      try {
        matchedThisCaptor = p.predicate(newHit)
      } catch (e) {
        matchedThisCaptor = false
        console.error('Exception matching', newHit, 'captor', p, 'e', e)
      }

      if (matchedThisCaptor) {

        if (p.messageField) {
          //TODO: clone here to avoid mutation. Or rather extract the store from the whole list
          newHit.message = newHit.fields[p.messageField] || newHit.message
        }

        if (!captures[p.key]) {
          captures[p.key] = []
        }
        captures[p.key].push(newHit)
        if (p.acknowledge === false) {
          newHit.tags = [...(newHit.tags || []), p.key]
        } else {
          //TODO: consider marking as "no pending"
          return //hit processing, do not want it to be pushed to the main hits 
        }
      }
    }
    hits.push(newHit)
  })
  return { hits, captures }
}

export default data