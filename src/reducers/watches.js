const watches = (state = [], action) => {
  switch (action.type) {
    case 'ADD_WATCH':
      let newState =  [
        ...state,
        {
          id: action.id,
          text: action.text
        }
      ]
      return newState
    case 'EDIT_WATCH':
      return state.map(watch =>
        (watch.id === action.id) 
          ? {...watch, text: action.text}
          : watch
      )
    case 'DELETE_WATCH':
      return state.filter(watch => watch.id !== action.id) 
    default:
      return state
  }
}

export default watches