import { combineReducers} from 'redux'
import watches from './watches'
import data from './data'
import synctimes from './synctimes'
import config from './config'
import versions from './versions'
import captorPredicatesUpdater from './captorPredicatesUpdater'

const combinedReducers = combineReducers({
  watches,
  data,
  synctimes,
  config,
  versions,
})

function kibanatorApp(state, action) {
  const intermediateState = combinedReducers(state, action);
  return captorPredicatesUpdater(intermediateState, action)
}

export default kibanatorApp