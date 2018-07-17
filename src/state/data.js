import {emptyState} from '../reducers/data'

export function watchIndexData(state, watchIndex) {
    return state.watches.data[watchIndex + ""]
}

export function selectedData(state, fallbackEmptyState) {
    const watchIndex = state.view.watchIndex
    if (undefined !== watchIndex) {
        let theData = watchIndexData(state, watchIndex + "")
        if (undefined !== theData) {
            return theData
        }
    }
    if (fallbackEmptyState) {
        return emptyState
    } else {
        return undefined
    }
}