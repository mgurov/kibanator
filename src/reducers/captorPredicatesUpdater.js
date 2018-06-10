import update from 'immutability-helper';
import _ from 'lodash'
import {captorToPredicate} from '../domain/Captor'

export default function captorPredicatesUpdater(state, action) {
    switch (action.type) {
        case 'ON_INIT':
        case 'ADD_CAPTOR':
        case 'REMOVE_CAPTOR':
        case 'SELECT_WATCH':
          return doCopy(state)
        default:
          return state
    }        
}

function doCopy(state) {
  let watchIndex = state.view.watchIndex
  if (undefined === watchIndex) {
    return state
  }
  let watchSelected = state.config.watches[watchIndex]
  let captorPredicates = _.flatMap(_.get(watchSelected, 'captors'), c => {
    try {
      return [captorToPredicate(c)]
    } catch (e) {
      console.error('error making predicate from captor', c, e)
      return []
    }
  }
  )
  return update(state, {data: {captorPredicates: {$set: captorPredicates}}} )
}