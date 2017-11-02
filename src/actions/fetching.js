import makeSearch from '../domain/search'
import { selectIndexInterval } from '../domain/elasticsearch'

export const fetchingData = () => {
    return {
        type: 'FETCHING_DATA'
    }
}

export const receiveData = (data, config, maxFetchReached) => {
    return {
        type: 'RECEIVED_HITS',
        data: data.hits,
        config: config,
        timestamp: new Date(),
        maxFetchReached,
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

export function fetchData({fromTimestamp=new Date(), toTimestamp=new Date(), config, onOkResponse=()=>{}}) {
    return function (dispatch) {
        dispatch(fetchingData())

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
            body: JSON.stringify(body),
        })
            .then(
            response => {
                dispatch(uiVersionAtServer(response.headers.get('Kibanator-UI-Version')))
                if (response.ok) {
                    onOkResponse(response);
                    return response.json();
                }
                throw new Error(response.statusText);
            }
            )
            .then(
            responseJson => {
                let maxFetchReached = undefined
                if (responseJson.hits.total > MAX_FETCH_SIZE) {
                    maxFetchReached = {
                        fetchTotal: responseJson.hits.total,
                        fetchLimit: MAX_FETCH_SIZE,
                    }
                }
                dispatch(receiveData(responseJson, config, maxFetchReached))
            },
            error => dispatch(failedFetchingData(error))
            )
    }
}

export function startFetching(fromTimestamp, config) {
    return function (dispatch) {

        let runningFrom = fromTimestamp

        let doFetch = () => {
            console.log('running from', runningFrom)
            let toTimestamp = new Date()
            let onOkResponse = (response) => {
                let newRunningFrom = new Date(toTimestamp)
                newRunningFrom.setHours(newRunningFrom.getHours() - 1)
                if (newRunningFrom > runningFrom) {
                    runningFrom = newRunningFrom
                }
                let delay = new Date() - toTimestamp
                if (delay > 1000) {
                    console.log('delay:', )
                }
            }
            dispatch(fetchData({fromTimestamp:runningFrom, toTimestamp, config, onOkResponse}))
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