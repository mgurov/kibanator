import watches from './watches'
import synctimes from './synctimes'
import config from './config'
import versions from './versions'
import fetchStatus from './fetchStatus'
import view from './view'

const combinedReducers = combineReducersWithState([
  //array as order might matter
  ['view', view],
  ['config', config],
  ['watches', watches],
  ['fetchStatus', fetchStatus],
  ['synctimes', synctimes],
  ['versions', versions],
])

function kibanatorApp(state, action) {
  return combinedReducers(state, action);
}

function combineReducersWithState(combination) {
  return (state, action) => {

    let newState = {...state}

    for (let [storeKey, reducer] of combination ) {
      newState[storeKey] = reducer(newState[storeKey], action, newState)
    }

    return newState
  }
}

export default kibanatorApp