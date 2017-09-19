const VERSION = process.env.REACT_APP_VERSION || 'DEV'
const versions = (state = {current: VERSION, server: undefined}, action) => {
  switch (action.type) {
    case 'VERSION_UI_AT_SERVER':
      return Object.assign({}, state, {server: action.payload})
    default:
      return state
  }
}

export default versions