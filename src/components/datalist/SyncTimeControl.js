import React from 'react'
import {Badge, Popover} from 'react-bootstrap'
import {DateTime, ConditionalOverlayTrigger} from '../generic/'

export function SyncTimeControl({selected, notAcked, acked}) {

    let stuff = [
        <span key="syncfrom">from<DateTime value={new Date(selected.from)} className="label label-default"/></span>,
    ]
    
    if (notAcked) {
        stuff.push(<span key="notAcked">
            &nbsp;pending&nbsp;
                <Badge>{notAcked}</Badge>
        </span>)
        
    }

    if (acked.count > 0) {
        let ackedPopover = (
            <Popover id="popover-trigger-hover-focus" title="Acknowledged">
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