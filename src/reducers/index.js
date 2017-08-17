import { combineReducers } from 'redux'
import watches from './watches'
import data from './data'
import synctimes from './synctimes'

const kibanatorApp = combineReducers({
  watches,
  data,
  synctimes,
})

export default kibanatorApp