const defaultOptions = [
    { name: '15 mins', nowToStart: now => now.setMinutes(now.getMinutes() - 15) },
    { name: '1 hour', nowToStart: now => now.setHours(now.getHours() - 1) },
    { name: '1 day', nowToStart: now => now.setDate(now.getDate() - 1) },
    { name: '1 week', nowToStart: now => now.setDate(now.getDate() - 7) },
    { name: '1 month', nowToStart: now => now.setMonth(now.getMonth() - 1) },
]

const synctimes = (state = { options:defaultOptions, selected: null}, action) => {
    switch (action.type) {
        case 'SELECT_SYNC_TIME':
            return Object.assign({}, state, {selected: action.selected.nowToStart(new Date())})
        default:
            return state
    }
}

export default synctimes