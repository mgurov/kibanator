import { combineReducers } from 'redux'
import watches from './watches'
import data from './data'
import synctimes from './synctimes'
import config from './config'

const kibanatorApp = combineReducers({
  watches,
  data,
  synctimes,
  config,
})

export default kibanatorApp