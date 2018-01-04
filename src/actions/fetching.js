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

export const receiveData2 = (data, config/* , maxFetchReached */) => {
    return {
        type: 'TMP_INCOMING_HITS',
        payload: {
            hits: data.hits,
            config,
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
        body: JSON.stringify(body),
        credentials: 'same-origin',
    })
}

export function fetchData({fromTimestamp=new Date(), toTimestamp=new Date(), config, onOkResponse=()=>{}}) {
    return function (dispatch) {
        dispatch(fetchingData())

        return doHttpFetch({fromTimestamp, toTimestamp, config})
        .then(
            response => {
                dispatch(uiVersionAtServer(response.headers.get('Kibanator-UI-Version')))
                if (response.ok) {
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
                dispatch(receiveData2(responseJson.hits, config))
                onOkResponse(maxFetchReached);                
            },
            error => dispatch(failedFetchingData(error))
        )
    }
}

export function startFetching(fromTimestamp, config) {
    return function (dispatch) {

        let runningFrom = fromTimestamp
        let maxFetchReached = false

        let doFetch = () => {

            if (maxFetchReached) {
                return; //hack to stop getting data if too many hits encountered
                //the reason for this is that with the introduction of the running from moment it is possible 
                //to miss a spike
            }

            let toTimestamp = new Date()
            let onOkResponse = (maxFetchReachedThisTime) => {
                maxFetchReached = !!maxFetchReachedThisTime
                let newRunningFrom = new Date(toTimestamp)
                newRunningFrom.setHours(newRunningFrom.getHours() - 1)
                if (newRunningFrom > runningFrom) {
                    runningFrom = newRunningFrom
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