import React from 'react'
import {Badge, Popover} from 'react-bootstrap'
import {DateTime, ConditionalOverlayTrigger} from '../generic/'
import {SelectTimeRange} from './SelectTimeRange'

export function SyncTimeControl(props) {

    const selected = props.synctimes.selected

    if (!selected) {
        return (<SelectTimeRange options={props.synctimes.options} onSelected={props.onSyncSelected}/>)
    }

    let stuff = [
        <span key="syncfrom">from<DateTime value={new Date(selected.from)} className="label label-default"/></span>,
    ]
    
    if (props.notAcked) {
        stuff.push(<span key="notAcked">
            &nbsp;pending&nbsp;
                <Badge>{props.notAcked}</Badge>
        </span>)
        
    }

    if (props.acked.count > 0) {
        let ackedPopover = (
            <Popover id="popover-trigger-hover-focus" title="Acknowledged">
                latest <DateTime value={new Date(props.acked.lastTimestamp)}></DateTime>
            </Popover>
        );
        stuff.push(<span key="acked">
            &nbsp;acked&nbsp;
            <ConditionalOverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={ackedPopover} visible={null != ackedPopover}>
                <Badge>{props.acked.count}</Badge>
            </ConditionalOverlayTrigger>
        </span>)
    }

    return <span>{stuff}</span>
}