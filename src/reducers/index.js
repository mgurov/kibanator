import { combineReducers } from 'redux'
import watches from './watches'
import data from './data'

const kibanatorApp = combineReducers({
  watches,
  data,
})

export default kibanatorApp