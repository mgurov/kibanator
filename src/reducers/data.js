import _ from 'lodash'
import LogHit from '../domain/LogHit'
import update from 'immutability-helper';
import * as constant from '../constant'
import {matchPredicates, captorKeyToView, captorToPredicate} from '../domain/Captor'

export const emptyState = {
  hits: {
    byId: {},
    newIds: [],
    ids: []
  },
  timeline: {},
  acked: {}, // id -> true
  draftFilter: null, // editing filter
}

const data = (state = emptyState, action, filters) => {
  switch (action.type) {
    case 'RESET_DATA': //reset all
      return emptyState
    case 'NEW_IDS_ARRIVED' : {
      let captorPredicates = _.flatMap(filters, c => {
        try {
          return [captorToPredicate(c)]
        } catch (e) {
          console.error('error making predicate from captor', c, e)
          return []
        }
      })
      return update(state, {
          hits: {
              newIds: {
                  $set: []
              },
          },
          timeline: {$set: reprocessTimeline({...state, captorPredicates})},
        })
    }
    case 'INCOMING_HITS':
      {
        let newHitsRaw = takeNewHits2(action.payload.hits, state.hits.byId)
        if (_.isEmpty(newHitsRaw)) {
          return state
        }
        const newHitsTransformed = _.mapValues(newHitsRaw, h => LogHit(h, action.payload.config))
        const allHitsById = {...state.hits.byId, ...newHitsTransformed}
        const newIds = _.keys(newHitsRaw);
        let ids = [...state.hits.ids, ...newIds].sort((idA, idB) => {
          let timestampA = allHitsById[idA].timestamp
          let timestampB = allHitsById[idB].timestamp
          if (timestampA < timestampB) {
            return -1
          } else if (timestampA > timestampB) {
            return 1
          } else {
            return 0
          }
        })

        return {
          ...state,
          hits: {
            ...state.hits,
            byId: allHitsById,
            newIds,
            ids
          }
        }
      }
    case 'ACK_ALL':
    {
      let newAcked = {...state.acked}
      for (let h of state.timeline.pending) {
        newAcked[h.id] = true
      }
      return {
        ...state,
        acked: newAcked,
      }
    }
  case 'ACK_ID':
      {
        return {
          ...state,
          acked: {...state.acked, [action.id]: true},
        }
      }
    case 'ACK_TILL_ID':
      {
        let newAcked = {...state.acked}
        for (let h of state.timeline.pending) {
          newAcked[h.id] = true
          if (h.id === action.id) {
            break
          }
        }
        return {
          ...state,
          acked: newAcked,
        }
      }
    case 'ACK_TAG':
      {
        let newAcked = {...state.acked}
        for (let h of state.timeline[captorKeyToView(action.payload.tag)]) {
          newAcked[h.id] = true
        }
        return {
          ...state,
          acked: newAcked,
        }
      }
    case 'ACK_PREDICATE':
      {
        let once = true
        let predicate = (h) => {
          let logHit = state.hits.byId[h.id]
          let result = matchPredicates(logHit, [action.payload.predicate])
          if (once) {
            once = false
          }
          return result.length === 1
        }
        let newAcked = {...state.acked}
        for (let h of state.timeline.pending) {
          if (predicate(h)) {
            newAcked[h.id] = true
          }
        }
        return {
          ...state,
          acked: newAcked,
        }
      }
    case 'APPLY_DRAFT_FILTER': {
      return {
        ...state,
        draftFilter: action.payload.predicate,
      }
    }
    default:
      return state
  }
}

function takeNewHits2(incomingHits, previouslyKnownHits) {
  let newHits = {}
  _.forEach(incomingHits, h => {
    let id = h._id
    if (previouslyKnownHits[id] || newHits[id]) {
      return
    }
    newHits[id] = h
  })

  return newHits
}

export const reprocessTimeline = ({hits, captorPredicates = [], acked = {}, draftFilter = null}) => {
  let result = {}

  function add(key, hit) {
    if (result[key]) {
      result[key].push(hit)
    } else {
      result[key] = [hit]
    }
  }

  for (let id of hits.ids) {
    let logHit = hits.byId[id]
    let h = {id, source: logHit}

    if (acked[id]) {
      add(constant.viewAcked, h)
      continue;
    }

    let ackedByCapture = false;
    let tags = []
    let messageOverride = null
    
    for (let matched of matchPredicates(logHit, captorPredicates)) {
      if (null === messageOverride && matched.message) {
        messageOverride = matched.message
      }
      add(captorKeyToView(matched.predicate.key), {...h, message: matched.message})
      if (false !== matched.predicate.acknowledge) {
        ackedByCapture = true
      }
      tags.push(matched.predicate.key)
    }
    
    if (!ackedByCapture) {
      h.tags = tags
      if (null !== messageOverride) {
        h.message = messageOverride
      }
      add(constant.viewPending, h)
      if (draftFilter && 1 === matchPredicates(logHit, [draftFilter]).length) {
        add(constant.viewFilterLikeThis, h)
      }
    }
  }
  return result
}

export default data