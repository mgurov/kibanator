const view = (state = { type: 'pending' }, action) => {
  switch (action.type) {
    case 'SHOW_VIEW':
      return Object.assign({}, state, action.payload)
    case 'REMOVE_CAPTOR':
      if (state.type === 'capture' && state.captorKey === action.captorKey) {
        return Object.assign({}, state,{type: 'pending'})
      } else {
        return state
      }
    default:
      return state
  }
}

export default view