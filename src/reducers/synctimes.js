const defaultOptions = [
    { name: '15 mins', nowToStart: now => now.setMinutes(now.getMinutes() - 15) },
    { name: '1 hour', nowToStart: now => now.setHours(now.getHours() - 1) },
    { name: '1 day', nowToStart: now => now.setDate(now.getDate() - 1) },
    { name: 'yesterday 17:00', nowToStart: now => {
        now.setDate(now.getDate() - 1)
        now.setHours(17)
        now.setMinutes(0)
        now.setSeconds(0)
        now.setMilliseconds(0)
        return now
    }},
    { name: 'Friday 17:00', nowToStart: now => {
        now.setDate(now.getDate() - 1)
        while (now.getDay() !== 5) {
            now.setDate(now.getDate() - 1)
        }
        now.setHours(17)
        now.setMinutes(0)
        now.setSeconds(0)
        now.setMilliseconds(0)
        return now
    }},
]

const startingState = {
    options:defaultOptions, 
    selected: null,
    intervalId: null,
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
            return Object.assign({}, state, {intervalId: action.intervalId})
        case 'RESET_DATA' : 
            return startingState //TODO: stop fetching?
        case 'FETCH_STOP_TIMER' : 
            window.clearInterval(state.intervalId)
            return Object.assign({}, state, {intervalId: null})
        default:
            return state
    }
}

export default synctimes