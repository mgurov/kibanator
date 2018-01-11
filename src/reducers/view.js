import {captorKeyToView} from '../domain/Captor'
const initialState = { key: 'pending' }

const view = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_VIEW':
      return Object.assign({}, state, action.payload)
    case 'REMOVE_CAPTOR':
      if (state.key === captorKeyToView(action.captorKey)) {
        return initialState
      } else {
        return state
      }
    case 'RESET_DATA': //reset all
      return initialState
    default:
      return state
  }
}

export default view
