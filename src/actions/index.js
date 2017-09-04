import {startFetching} from './fetching'

let nextId = 1
export const getNextId = () => nextId++

export const addWatch = text => {
  return {
    type: 'ADD_WATCH',
    id: getNextId(),
    text
  }
}

export const editWatch = (text, id) => {
  return {
    type: 'EDIT_WATCH',
    id,
    text
  }
}

export const deleteWatch = id => {
  return {
    type: 'DELETE_WATCH',
    id
  }
}

export const selectSyncTime = selected => {
  
  return function(dispatch) {
    dispatch({type: 'SELECT_SYNC_TIME', selected})
    
    startFetching(new Date(selected.nowToStart(new Date())), dispatch)    
  }  
}

export const removeTillId = id => {
  return {
    type: 'REMOVE_TILL_TICK_ID',
    id
  }
}

export const toggleFavorite = id => {
  return {
    type: 'TOGGLE_FAVORITE_ID',
    id
  }
}

export const setConfig = newState => {
  return {
    type: 'SET_CONFIG',
    newState
  }
}

export * from "./fetching"