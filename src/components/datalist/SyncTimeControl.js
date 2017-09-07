import React from 'react'
import {Badge, Popover, Button} from 'react-bootstrap'
import {DateTime, ConditionalOverlayTrigger} from '../generic/'

export function SyncTimeControl({selected, notAcked, acked, lastSync, ackAll}) {

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
    
    if (notAcked) {
        let pendingTimesPopover = (
            <Popover id="pending-times" title="Pending">
                <p>First <DateTime value={notAcked.firstTimestamp}/></p>
                <p>Last <DateTime value={notAcked.lastTimestamp}/></p>
            </Popover>
        );
    
        stuff.push(<span key="notAcked">
            &nbsp;pending&nbsp;
                <ConditionalOverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={pendingTimesPopover} visible={true}>
                    <Badge>{notAcked.count}</Badge>
                </ConditionalOverlayTrigger>
        </span>)
        
        if (notAcked.count > 0) {
            stuff.push(<Button 
                key="ack_all" 
                className="btn btn-xs glyphicon glyphicon-ok" 
                title="Ack all"
                onClick={ackAll}
                />)
        }
    }

    if (acked.count > 0) {
        let ackedPopover = (
            <Popover id="popover-acked-count" title="Acknowledged">
                <p>First <DateTime value={acked.firstTimestamp}/></p>
                <p>Last <DateTime value={acked.lastTimestamp}/></p>
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