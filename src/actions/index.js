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
  }  
}

export const ackTillId = id => {
  return {
    type: 'ACK_TILL_ID',
    id
  }
}

export const ackId = id => {
  return {
    type: 'ACK_ID',
    id,
    payload: {id},
  }
}

export const ackAll = id => {
  return {
    type: 'ACK_ALL'
  }
}

export const markHit = id => {
  return {
    type: 'MARK_HIT',
    payload: {id}
  }
}

export const unmarkHit = id => {
  return {
    type: 'UNMARK_HIT',
    payload: {id}
  }
}

export const setConfig = newState => {
  return {
    type: 'SET_CONFIG',
    newState
  }
}

export const addCaptor = (captor) => {
  return {
    type: 'ADD_CAPTOR',
    captor,
  }
}

export const removeCaptor = (captorKey) => {
  return {
    type: 'REMOVE_CAPTOR',
    captorKey,
  }
}

export const showView = (payload) => {
  return {
    type: 'SHOW_VIEW',
    payload
  }
}

export * from "./fetching"