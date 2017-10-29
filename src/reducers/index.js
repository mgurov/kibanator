import { combineReducers} from 'redux'
import watches from './watches'
import data from './data'
import synctimes from './synctimes'
import config from './config'
import versions from './versions'
import fetchStatus from './fetchStatus'
import captorPredicatesUpdater from './captorPredicatesUpdater'
import view from './view'

const combinedReducers = combineReducers({
  watches,
  data,
  fetchStatus,
  synctimes,
  config,
  versions,
  view,
})

function kibanatorApp(state, action) {
  const intermediateState = combinedReducers(state, action);
  return captorPredicatesUpdater(intermediateState, action)
}

export default kibanatorApp