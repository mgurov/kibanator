import React from 'react'
import { ButtonGroup, Button, Badge, Popover} from 'react-bootstrap'
import _ from 'lodash'
import {DateTime, ConditionalOverlayTrigger} from '../generic/'

export function SyncTimeControl(props) {

    const selected = props.synctimes.selected

    if (!selected) {
        function onClickF(st) {
            return function () {
                props.onSyncSelected(st)
            }
        }
        let timeRangeButton = (<ButtonGroup key="timeRangeButton" title="Sync" id="bg-nested-dropdown">
        {
            _.map(props.synctimes.options, st => <Button 
                key={st.name} 
                onClick={onClickF(st)}
                >{st.name}</Button>)
        }
        </ButtonGroup>)
        return timeRangeButton
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