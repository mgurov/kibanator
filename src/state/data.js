import {emptyState} from '../reducers/data'
export function selectedData(state, fallbackEmptyState) {
    const watchIndex = state.view.watchIndex
    if (undefined !== watchIndex) {
        let theData = state.watches.data[watchIndex + ""]
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