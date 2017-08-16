import makeSearch from '../domain/search'

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

export const fetchingData = () => {
  return {
    type: 'FETCHING_DATA'
  }
}

export const receiveData = (data) => {
  return {
    type: 'RECEIVED_HITS',
    data: data.hits
  }
}

export const failedFetchingData = (error) => {
  console.log('failed to receive some', error)
  return {
    type: 'FAILED_FETCHING_DATA',
    error
  }
}

//hack
let from = -10;

export function fetchData() {
  return function (dispatch) {
    dispatch(fetchingData())

    from = from + 10
    return fetch('/mylog/_search?size=10&from=' + from, {
      method: "GET",
      body: makeSearch('foo')
    })
      .then(
        response => {
            if (response.ok) {
              return response;
            }
            throw new Error(response.statusText);
          }
      )
      .then(
        response => response.json(),
        error => dispatch(failedFetchingData(error))
      )
      .then(json =>
        dispatch(receiveData(json))
      )
  }
}