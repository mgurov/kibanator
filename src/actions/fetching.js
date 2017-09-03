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

//hack from
//let from = -10;
export function fetchData(fromTimestamp, config) {
    return function (dispatch) {
        dispatch(fetchingData())

        //hack from
        //from = from + 10
        //?size=10&from=' + from
        return fetch('/' + config.index +'/_search?size=10000', {
            method: "POST",
            body: JSON.stringify(makeSearch({ serviceName: config.serviceName, from: fromTimestamp, config }))
        })
            .then(
            response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            }
            )
            .then(
            responseJson => dispatch(receiveData(responseJson)),
            error => {
                dispatch(failedFetchingData(error))
            }
            )
    }
}

export function startFetching(fromTimestamp, dispatch) {
    //hack, need to learn how to pass the config conveniently instead

    let config
    let localConfig = localStorage.getItem('config')
    if (localConfig) {
        config = JSON.parse(localConfig)
    } else {
        throw Error('need some config before fetching')
    }

    let doFetch = () => dispatch(fetchData(fromTimestamp, config))
    doFetch()
    let intervaldId = setInterval(doFetch, 5000)
    dispatch(startedFetchTimer(intervaldId))
}

export function stopFetchTimer() {
    return {
        type: 'FETCH_STOP_TIMER',
    }
}
export function startedFetchTimer(intervaldId) {
    return {
        type: 'FETCH_STARTED_TIMER',
        intervaldId
    }
}