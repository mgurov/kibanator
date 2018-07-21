import {captorKeyToView} from '../domain/Captor'
const initialState = { key: 'pending', watchIndex: undefined }

const view = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_VIEW':
      return Object.assign({}, state, action.payload)
    case 'REMOVE_CAPTOR':
      if (state.key === captorKeyToView(action.payload.captorKey)) {
        return {...state, key: 'pending'}
      } else {
        return state
      }
    case 'RESET_DATA': //reset all
      return {...state, key: 'pending'}
    case 'SELECT_WATCH':
      return {...state, watchIndex: action.payload.watchIndex}
    default:
      return state
  }
}

export default view
