const data = (state = {isFetching: false, data: [], error: null}, action) => {
  switch (action.type) {
    case 'FETCHING_DATA':
      return Object.assign({}, state, {isFetching: true})
    case 'RECEIVED_HITS':
      return Object.assign({}, state, {isFetching: false, data: action.data.hits})
    case 'FAILED_FETCHING_DATA':
    return Object.assign({}, state, {isFetching: false, error: action.error})
    default:
      return state
  }
}

export default data