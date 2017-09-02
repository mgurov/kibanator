import React from 'react'
import {Badge, Popover} from 'react-bootstrap'
import {DateTime, ConditionalOverlayTrigger} from '../generic/'

export function SyncTimeControl({selected, notAcked, acked, lastSync}) {

    let stuff = []

    let syncingFrom 
    if (lastSync) {
        syncingFrom = <DateTime value={lastSync} className="label label-default"/>
    } else {
        syncingFrom = <span>fetching...</span>
    }

    let timesPopover = (
        <Popover id="sync-times" title="Sync times">
            <p>Fetching from <DateTime value={new Date(selected.from)}></DateTime></p>
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
    
    if (notAcked) {
        stuff.push(<span key="notAcked">
            &nbsp;pending&nbsp;
                <Badge>{notAcked}</Badge>
        </span>)
        
    }

    if (acked.count > 0) {
        let ackedPopover = (
            <Popover id="popover-acked-count" title="Acknowledged">
                latest <DateTime value={new Date(acked.lastTimestamp)}></DateTime>
            </Popover>
        );
        stuff.push(<span key="acked">
            &nbsp;acked&nbsp;
            <ConditionalOverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={ackedPopover} visible={null != ackedPopover}>
                <Badge>{acked.count}</Badge>
            </ConditionalOverlayTrigger>
        </span>)
    }

    return <span>{stuff}</span>
}