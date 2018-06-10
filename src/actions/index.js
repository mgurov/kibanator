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

export const setConfig = ({value, index}) => {
  return {
    type: 'SET_CONFIG',
    payload: {
      value,
      index,
    }
  }
}

export const removeConfig = ({watchIndex}) => {
  return {
    type: 'RM_CONFIG',
    payload: {
      watchIndex,
    }
  }
}

export const addCaptor = ({captor, watchIndex}) => {
  return {
    type: 'ADD_CAPTOR',
    payload: {captor, watchIndex},
  }
}

export const removeCaptor = ({captorKey, watchIndex}) => {
  return {
    type: 'REMOVE_CAPTOR',
    payload: {captorKey, watchIndex},
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

export const selectWatch = ({watchIndex}) => {
  return {
    type: 'SELECT_WATCH',
    payload: {watchIndex}
  }
}

export * from "./fetching"