import {
    createStore,
    applyMiddleware
} from 'redux'

import thunkMiddleware from 'redux-thunk'
import {readConfigFromLocalStore, persistConfigChangesMiddleware} from './reducers/config'
//import { createLogger } from 'redux-logger'
import {watchIndexData} from './state/data'

import kibanatorApp from './reducers'
import _ from 'lodash'

const onNewHitsArrivedMiddleware = store => {
    return next => action => {
        
        let r = next(action)

        if (
            action.type === 'ACK_ID'
            || action.type === 'ACK_TILL_ID'
            || action.type === 'ACK_TAG'
            || action.type === 'ACK_ALL'
            || action.type === 'ADD_CAPTOR'
            || action.type === 'REMOVE_CAPTOR'
            || action.type === 'APPLY_DRAFT_FILTER'
            || action.type === 'ACK_PREDICATE'
        ) {
            store.dispatch({
                type: 'NEW_IDS_ARRIVED', //TODO: different type, also just listen for the changes
                payload: {
                    watchIndex: _.get(action, 'payload.watchIndex')
                }
            })
            return r
        }

        if (action.type !== 'INCOMING_HITS') {
            return r
        }

        let state = store.getState();
        let watchIndex = action.payload.watchIndex
        let data = watchIndexData(state, watchIndex)
        if (data === undefined) {
            console.warn('no selected data to propagate incoming hits')
            return r
        }
        const newIds = data.hits.newIds

        if (newIds && newIds.length > 0) {
            store.dispatch({
                type: 'NEW_IDS_ARRIVED',
                payload: {
                    newIds,
                    watchIndex,
                },
            })
        }
        return r
    }
}

export function newStore() {
    let store = createStore(
        kibanatorApp,
        applyMiddleware(thunkMiddleware, onNewHitsArrivedMiddleware, persistConfigChangesMiddleware)
    )
    store.dispatch({
        type: 'ON_INIT',
        payload: {
            config: readConfigFromLocalStore()
        }
    })

    return store
}