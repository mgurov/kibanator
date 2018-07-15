import watches from './watches'
import synctimes from './synctimes'
import config from './config'
import versions from './versions'
import fetchStatus from './fetchStatus'
import view from './view'
import _ from 'lodash'

const combinedReducers = combineReducersWithState({
  view,
  watches,
  fetchStatus,
  synctimes,
  config,
  versions,
})

function kibanatorApp(state, action) {
  return combinedReducers(state, action);
}

function combineReducersWithState(combination) {
  return (state, action) => {
    return _.mapValues(combination, (reducer, key)=> reducer(state[key], action, state))
  }
}

export default kibanatorApp