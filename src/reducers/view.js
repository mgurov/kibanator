import * as constant from '../constant'
const initialState = { key: 'pending' }

const view = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_VIEW':
      return Object.assign({}, state, action.payload)
    case 'REMOVE_CAPTOR':
      if (state.key === constant.viewCapturePrefix + action.captorKey) {
        return initialState
      } else {
        return state
      }
    case 'FETCH_STOP_TIMER': //reset all
      return initialState
    default:
      return state
  }
}

export default view
