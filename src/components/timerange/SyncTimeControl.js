import React from 'react'
import {Popover} from 'react-bootstrap'
import {DateTime, ConditionalOverlayTrigger} from '../generic/'

export function SyncTimeControl({selected, lastSync}) {

    let stuff = []

    let syncingFrom 
    if (lastSync) {
        syncingFrom = <DateTime value={lastSync} className="label label-default"/>
    } else {
        syncingFrom = <span>fetching...</span>
    }

    let timesPopover = (
        <Popover id="sync-times" title="Sync times">
            <p>Fetching from <DateTime value={new Date(selected.from)}/></p>
            <p>Last sync <DateTime value={lastSync}/></p>
        </Popover>
    );

    stuff.push(
        <span key="syncTimes">
            <ConditionalOverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={timesPopover} visible={null != timesPopover}>
                {syncingFrom}
            </ConditionalOverlayTrigger>
        </span>
    )
    
    return <span>{stuff}</span>
}