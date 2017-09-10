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
store.dispatch({type: 'ON_INIT'})
let [currentWatches, currentConfig] = [null, null]
store.subscribe(() => {
    let state = store.getState()
    if (currentWatches !== state.watches) {
        localStorage.setItem('watches', JSON.stringify(state.watches))
        currentWatches = state.watches
    }
    if (currentConfig !== state.config) {
        localStorage.setItem('config', JSON.stringify(state.config))
        currentConfig = state.config
    }
})

export default store;
