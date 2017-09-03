const defaultOptions = [
    { name: '15 mins', nowToStart: now => now.setMinutes(now.getMinutes() - 15) },
    { name: '1 hour', nowToStart: now => now.setHours(now.getHours() - 1) },
    { name: '1 day', nowToStart: now => now.setDate(now.getDate() - 1) },
    { name: '1 week', nowToStart: now => now.setDate(now.getDate() - 7) },
    { name: '1 month', nowToStart: now => now.setMonth(now.getMonth() - 1) },
]

const startingState = {
    options:defaultOptions, 
    selected: null,
    intervaldId: null,
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
        case 'FETCH_STARTED_TIMER':
            return Object.assign({}, state, {intervaldId: action.intervaldId})
        case 'FETCH_STOP_TIMER' : 
            window.clearInterval(state.intervaldId)
            return startingState
        return Object.assign({}, state, {timerStopFunction: action.timerStopFunction})
        default:
            return state
    }
}

export default synctimes