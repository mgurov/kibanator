let nextId = 1
export const getNextId = () => nextId++

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

export const ackTag = tag => {
  return {
    type: 'ACK_TAG',
    payload: {tag}
  }
}

export const resetData = id => {
  return {
    type: 'RESET_DATA'
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

export const applyDraftFilter = (payload) => {
  return {
    type: 'APPLY_DRAFT_FILTER',
    payload
  }
}

export const ackPredicate = (payload) => {
  return {
    type: 'ACK_PREDICATE',
    payload
  }
}

export * from "./fetching"