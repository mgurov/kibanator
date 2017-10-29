export const emptyState = {
    isFetching: false,
    error: null,
    lastSync: null,
}

const fetchStatus = (state = emptyState, action) => {
    switch (action.type) {
        case 'FETCHING_DATA':
            return { ...state, isFetching: true };
        case 'FAILED_FETCHING_DATA':
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        case 'RECEIVED_HITS':
            return {
                ...state,
                isFetching: false,
                error: null,
                lastSync: action.timestamp,
            };
        default:
            return state
    }
}

export default fetchStatus