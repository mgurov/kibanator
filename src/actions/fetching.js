import makeSearch from '../domain/search'
import { selectIndexInterval } from '../domain/elasticsearch'

export const fetchingData = () => {
    return {
        type: 'FETCHING_DATA'
    }
}

export const receiveData = (data, config, timestamp) => {
    return {
        type: 'INCOMING_HITS',
        payload: {
            hits: data.hits,
            config,
            timestamp,
        },
    }
}

export const failedFetchingData = (error) => {
    return {
        type: 'FAILED_FETCHING_DATA',
        error
    }
}

const refreshInterval = process.env.REACT_APP_INTERVAL || 60000
const API_PATH = process.env.REACT_APP_API_PATH || ''
const MAX_FETCH_SIZE = 10000

function doHttpFetch({fromTimestamp, toTimestamp, config}) {
    let index = config.index
    let ignoreMissingIndex = false
    let now = toTimestamp
    if (index.indexOf("*") >= 0) {
        let dates = selectIndexInterval('', fromTimestamp, now)
        index = dates.map(d => index.replace("*", d)).join(",")
        ignoreMissingIndex = true
    }
    let body = makeSearch({ serviceName: config.serviceName, from: fromTimestamp, to: now, config })
    return fetch(API_PATH + '/' + index + '/_search?size=' + MAX_FETCH_SIZE + '&ignore_unavailable=' + ignoreMissingIndex, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify(body),
        credentials: 'same-origin',
    })
}

export function fetchData({fromTimestamp=new Date(), toTimestamp=new Date(), config, onResponse=()=>{}}) {
    return function (dispatch) {
        dispatch(fetchingData())

        return doHttpFetch({fromTimestamp, toTimestamp, config})
        .then(
            response => {
                dispatch(uiVersionAtServer(response.headers.get('Kibanator-UI-Version')))
                if (response.ok) {
                    return response.json();
                }
                if (response.status === 401) {
                    let error = {
                        name: `Panic: response not authorized`,
                        message: `To prevent your password lockout the polling has been stopped. Please check your credentials and restart. Response.status: ${response.status} message: ${response.statusText}`,
                    }
                    dispatch(failedFetchingData(error))
                    dispatch(stopFetchTimer())
                    throw error
                }
                throw new Error(response.statusText);
            }
            )
        .then(
            responseJson => {
                dispatch(receiveData(responseJson.hits, config, new Date()))
                let maxFetchReached = responseJson.hits.total > MAX_FETCH_SIZE
                if (maxFetchReached) {
                    let error = {
                        name: `Max fetch limit of ${MAX_FETCH_SIZE} has been reached. ${responseJson.hits.total - MAX_FETCH_SIZE} records skipped. The polling of the new lines has been stopped.`,
                        message: 'Reset from a later point in time to continue. Please note that the marks will be lost upon this operation.',
                    }
                    dispatch(failedFetchingData(error))        
                    dispatch(stopFetchTimer())
                }
                onResponse();
            },
            error => dispatch(failedFetchingData(error))
        )
    }
}

export function startFetching(fromTimestamp, config) {
    return function (dispatch) {

        let runningFrom = fromTimestamp
        let doFetch = () => {
            let toTimestamp = new Date()
            let onResponse = () => {
                let newRunningFrom = new Date(toTimestamp)
                newRunningFrom.setHours(newRunningFrom.getHours() - 1)
                if (newRunningFrom > runningFrom) {
                    runningFrom = newRunningFrom
                }
            }

            dispatch(fetchData({fromTimestamp:runningFrom, toTimestamp, config, onResponse}))
        }

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

export function uiVersionAtServer(version) {
    return {
        type: 'VERSION_UI_AT_SERVER',
        payload: version
    }
}