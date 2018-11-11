const startingState = {
    selected: null,
    intervalId: null,
    fetchedWatchIndexes: []
}

const synctimes = (state = startingState, action) => {
    switch (action.type) {
        case 'SELECT_SYNC_TIME':
            const now = new Date()
            return Object.assign({}, state, {
                selected: {
                    entry: action.selected,
                    from : action.selected.nowToStart(now),
                    at: now,
                }
            })
        case 'FETCH_STARTED_TIMER': {
            let {intervalId, watchIndexes} = action.payload
            return Object.assign({}, state, {intervalId: intervalId, fetchedWatchIndexes: watchIndexes})
        }
            
        case 'RESET_DATA' : 
            return startingState
        case 'FETCH_STOP_TIMER' : {
            window.clearInterval(state.intervalId)
            return Object.assign({}, state, {intervalId: null, fetchedWatchIndexes: []})
        }
        default:
            return state
    }
}

export default synctimes