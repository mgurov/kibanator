import React from 'react'
import {DateTime} from '../generic/'

export function SyncTimeControl({selected, lastSync, syncIntervalId}) {

    let syncingFrom 
    if (lastSync) {
        syncingFrom = <DateTime value={lastSync} className="badge badge-light"/>
    } else if (syncIntervalId) {
        syncingFrom = <span>fetching...</span>
    } else {
        syncingFrom = <span>stopped</span>
    }

    return <span data-test-id="fetch-status">{syncingFrom}</span>
}