const startingState = [];

const emptyEntry = {
    watchIndex: null,
    selectedTimeRange: null,
    pollingIntervalId: null
}

const synctimes = (state = startingState, action) => {
    switch (action.type) {
        case 'SELECT_SYNC_TIME':
            {
                let {watchIndex, selected} = action.payload
                const now = new Date()
                const selectedTimeRange = {
                    entry: selected,
                    from: selected.nowToStart(now),
                    at: now,
                }
                return adjustEntry(
                    state,
                    watchIndex,
                    entry => { return { ...entry, selectedTimeRange } }
                )
            }
        case 'FETCH_STARTED_TIMER': {
            let { intervalId, watchIndex } = action.payload
            return adjustEntry(
                state, 
                watchIndex,
                entry => { return { ...entry, pollingIntervalId: intervalId } }
            )
        }
        case 'RESET_DATA':
            return startingState
        case 'FETCH_STOP_TIMERS': {
            return state.map(entry => {
                window.clearInterval(entry.pollingIntervalId)
                return {...entry, pollingIntervalId: null}
            }
            )
        }
        default:
            return state
    }
}

// returns adjusted state
function adjustEntry(state, watchIndex, adjuster) {
    let found = false
    let newState = state.map(entry => {
        if (entry.watchIndex === watchIndex) {
            found = true
            return adjuster(entry)
        } else {
            return entry
        }
    })
    if (!found) {
        newState = [...newState, adjuster({...emptyEntry, watchIndex})]
    }
    return newState
}

export default synctimes