import dataReducer from './data'
import configReducer from './config'
import _ from 'lodash'

export const initialState = []

export default function watches(state = initialState, action) {

    if (action.type === 'ON_INIT') {
        let watches = _.get(action.payload.config, 'watches') || []

        let initial = _.map(watches,
            watch => { return { config: watch, data: dataReducer(undefined, action, watch.captors) } }
        )
        return initial
    }

    if (action.type === 'SET_CONFIG') {
        let { index, value } = action.payload
        let watches = [...state]
        if (index === undefined) {
            watches.push({ config: value, data: dataReducer(undefined, action, undefined) })
        } else {
            watches[index] = { ...watches[index], config: value }
        }
        return watches
    }

    if (action.type === 'RM_CONFIG') {
        let { watchIndex } = action.payload
        return state.filter((e, i) => i + "" !== watchIndex)
    }

    //cross-watch actions
    if (action.type === 'RESET_DATA') {
        return _.map(state, (watch) => { return { ...watch, data: dataReducer(undefined, action, watch.captors) } })
    }


    //delegate the rest to the specific data reducer if watchIndex present
    let watchIndex = _.get(action, 'payload.watchIndex')

    if (undefined === watchIndex) {
        return state
    }

    let watch = state[watchIndex]
    let oldConfig = watch.config
    let newConfig = configReducer(oldConfig, action)

    let oldData = watch.data
    let newData = dataReducer(oldData, action, newConfig.captors)

    if (oldConfig === newConfig && oldData === newData) {
        return state //no changes
    }

    let result = [...state]
    result[watchIndex] = { config: newConfig, data: newData }
    return result
}