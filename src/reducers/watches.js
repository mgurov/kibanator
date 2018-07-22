import data from './data'
import _ from 'lodash'

const startingState = {
    data: {}
}

export default function watches (state = startingState, action, fullState) {

    if (action.type === 'ON_INIT') {
        let initialData = _.fromPairs(_.map(fullState.config.watches, (watch, watchIndex) => [watchIndex, applyDataAction(undefined, watchIndex + "", action)]))
        return {...state, data: initialData}
    }

    //cross-watch actions
    if (action.type === 'RESET_DATA') {
        return {...state, data: _.mapValues(state.data, (d, watchIndex) => applyDataAction(d, watchIndex, action))}
    }
    
    if (action.type === 'SET_CONFIG' || action.type === 'RM_CONFIG') {
        let newData = {}
        _.forEach(fullState.config.watches, (watch, watchIndex) => {
            newData[watchIndex] = applyDataAction(state.data[watchIndex + ""], watchIndex, action)
        })
        
        return {...state, data: newData}
    }
    
    //delegate the rest to the specific data reducer if watchIndex present
    let watchIndex = _.get(action, 'payload.watchIndex')

    if (undefined === watchIndex) {
        return state
    }

    watchIndex = "" + watchIndex //stringify index

    let updatedData = applyDataAction(state.data[watchIndex], watchIndex, action)

    let result = {...state, data: {
        ...state.data,
        [watchIndex]: updatedData
    }}

    return result

    function applyDataAction(watchData, watchIndex, action) {
        watchIndex = "" + watchIndex //stringify index

        let filters = _.get(fullState.config.watches[watchIndex], 'captors')
    
        let updatedData = data(watchData, action, filters)
    
        if (undefined === updatedData) {
            console.warn('unexpectedly undefined data for watch index', watchIndex)
        }

        return updatedData
    }
}