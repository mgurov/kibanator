import { createStore, applyMiddleware } from 'redux'

import thunkMiddleware from 'redux-thunk'
//import { createLogger } from 'redux-logger'

import {getNextId} from './actions'
import kibanatorApp from './reducers'

let watches = JSON.parse(localStorage.getItem('watches') || '[]')
    .map((v) => { return { id : getNextId(), text: v.text }})
let config
let localConfig = localStorage.getItem('config')
if (localConfig) {
    config = JSON.parse(localConfig)
}

let store = createStore(
    kibanatorApp, 
    {watches, config},
    applyMiddleware(thunkMiddleware /* , createLogger() */)
)
store.subscribe(() => {
    let state = store.getState()
    localStorage.setItem('watches', JSON.stringify(state.watches))
    localStorage.setItem('config', JSON.stringify(state.config))
})

export default store;
