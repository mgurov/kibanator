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
        case 'INCOMING_HITS':{
            let newStatus = {
                ...state,
                isFetching: false,
                error: null,
                lastSync: action.payload.timestamp,
            }
            if (action.maxFetchReached) {
                newStatus.error = {
                    name: `Max fetch limit of ${action.maxFetchReached.fetchLimit} has been reached. ${action.maxFetchReached.fetchTotal - action.maxFetchReached.fetchLimit} records skipped. The polling of the new lines has been stopped.`,
                    message: 'Reset from a later point in time to continue. Please note that the marks will be lost upon this operation.',
                }
            }
            return newStatus;    
        }
        default:
            return state
    }
}

export default fetchStatus