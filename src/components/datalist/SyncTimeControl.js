import React from 'react'
import {Badge, Popover, Button} from 'react-bootstrap'
import {DateTime, ConditionalOverlayTrigger} from '../generic/'

export function SyncTimeControl({selected, pendingCount, acked, lastSync, ackAll}) {

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
    
    if (pendingCount > 0) {
        stuff.push(<span key="pending">
            &nbsp;pending&nbsp;<Badge>{pendingCount}</Badge></span>)
        
        stuff.push(<Button 
            key="ack_all" 
            className="btn btn-xs glyphicon glyphicon-ok" 
            title="Ack all"
            onClick={ackAll}
            />)
    }

    if (acked.length > 0) {
        stuff.push(<span key="acked">
            &nbsp;acked&nbsp;<Badge>{acked.length}</Badge>
        </span>)
    }

    return <span>{stuff}</span>
}