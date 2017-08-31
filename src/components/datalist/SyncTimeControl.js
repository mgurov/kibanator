import React from 'react'
import { ButtonGroup, Button, Badge, Popover} from 'react-bootstrap'
import _ from 'lodash'
import {DateTime, ConditionalOverlayTrigger} from '../generic/'

export function SyncTimeControl(props) {

    const selected = props.synctimes.selected

    function onClickF(st) {
        return function () {
            props.onSyncSelected(st)
        }
    }

    let disabledButton = !!selected;
    let visibleButtonPredicate = selected ? (e) => e === selected.entry : () => true

    let timeRangeButton = (<ButtonGroup key="timeRangeButton" title="Sync" id="bg-nested-dropdown">
    {
        _.filter(props.synctimes.options, visibleButtonPredicate).map(st => <Button 
            key={st.name} 
            onClick={onClickF(st)}
            disabled={disabledButton}
            >{st.name}</Button>)
    }
    </ButtonGroup>)

    let stuff = [
        timeRangeButton,
    ]
    if (selected) {
        stuff.push(<span key="syncfrom">Syncing from <DateTime value={new Date(selected.from)}></DateTime></span>)
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

    if (props.shown) {
        stuff.push(<span key="shown">
            &nbsp;shown&nbsp;
                <Badge>{props.shown}</Badge>
        </span>)
        
    }
    if (props.notAcked) {
        stuff.push(<span key="notAcked">
            &nbsp;from&nbsp;
                <Badge>{props.notAcked}</Badge>
        </span>)
        
    }
    //props.shown

    return <span>{stuff}</span>
}