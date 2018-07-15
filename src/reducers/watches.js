import data from './data'
import _ from 'lodash'

const startingState = {
    data: {}
}

export default function watches (state = startingState, action, fullState) {

    if (action.type === 'RESET_DATA') {
        return startingState
    }

    //delegate the rest to the specific data reducer if watchIndex present
    let watchIndex = _.get(action, 'payload.watchIndex')

    if (undefined === watchIndex) {
        watchIndex =  _.get(fullState, 'view.watchIndex')
    }

    if (undefined === watchIndex) {
        return startingState
    }

    watchIndex = "" + watchIndex //stringify index

    let filters = _.get(fullState.config.watches[watchIndex], 'captors')

    let updatedData = data(state.data[watchIndex], action, filters)

    if (undefined === updatedData) {
        console.warn('unexpectedly undefined data for watch index', watchIndex)
    }

    return {...state, data: {
        ...state.data,
        [watchIndex]: updatedData
    }}
}