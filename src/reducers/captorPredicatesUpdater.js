import update from 'immutability-helper';
import _ from 'lodash'
import {captorToPredicate} from '../domain/Captor'

export default function captorPredicatesUpdater(state, action) {
    switch (action.type) {
        case 'ON_INIT':
        case 'ADD_CAPTOR':
        case 'REMOVE_CAPTOR':
          let captorPredicates = _.flatMap(state.config.captors, c => {
            try {
              return [captorToPredicate(c)]
            } catch (e) {
              console.error('error making predicate from captor', c, e)
              return []
            }
          }
          )
          return update(state, {data: {captorPredicates: {$set: captorPredicates}}} )
        default:
          return state
    }        
}