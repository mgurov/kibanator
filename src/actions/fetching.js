import makeSearch from '../domain/search'
import {selectIndexInterval} from '../domain/elasticsearch'

export const fetchingData = () => {
    return {
        type: 'FETCHING_DATA'
    }
}

export const receiveData = (data, config) => {
    return {
        type: 'RECEIVED_HITS',
        data: data.hits,
        config: config,
        timestamp: new Date(),
    }
}

export const failedFetchingData = (error) => {
    return {
        type: 'FAILED_FETCHING_DATA',
        error
    }
}

const refreshInterval = process.env.REACT_APP_INTERVAL || 60000
const API_PATH=process.env.REACT_APP_API_PATH || ''

export function fetchData(fromTimestamp, config) {
    return function (dispatch) {
        dispatch(fetchingData())

        let index = config.index
        let ignoreMissingIndex = false
        let now = new Date()
        if (index.indexOf("*") >= 0) {
            let dates = selectIndexInterval('', fromTimestamp, now)
            index = dates.map(d => index.replace("*", d)).join(",")
            ignoreMissingIndex = true
        }
        let body = makeSearch({ serviceName: config.serviceName, from: fromTimestamp, to: now, config })
        return fetch(API_PATH + '/' + index + '/_search?size=10000&ignore_unavailable=' + ignoreMissingIndex, {
            method: "POST",
            body: JSON.stringify(body),
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
            responseJson => dispatch(receiveData(responseJson, config)),
            error => {dispatch(failedFetchingData(error))}
            )
    }
}

export function startFetching(fromTimestamp, config) {
    return function(dispatch) {
        let doFetch = () => dispatch(fetchData(fromTimestamp, config))
        doFetch()
        let intervaldId = setInterval(doFetch, refreshInterval)
        dispatch(startedFetchTimer(intervaldId))
    }
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