import makeSearch from '../domain/search'

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
    return {
        type: 'FAILED_FETCHING_DATA',
        error
    }
}

//hack
let from = -10;

export function fetchData(fromTimestamp) {
    return function (dispatch) {
        dispatch(fetchingData())

        from = from + 10
        return fetch('/mylog/_search?size=10&from=' + from, {
            method: "POST",
            body: JSON.stringify(makeSearch({serviceName: 'foo', from: fromTimestamp}))
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

export function startFetching(fromTimestamp, dispatch) {
    let doFetch = () => dispatch(fetchData(fromTimestamp))
    doFetch()
    setInterval(doFetch, 5000)
}