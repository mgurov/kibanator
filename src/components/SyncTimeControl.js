import React from 'react'
import { DropdownButton, MenuItem, Badge, Popover} from 'react-bootstrap'
import _ from 'lodash'
import {DateTime, ConditionalOverlayTrigger} from './generic/'

export function SyncTimeControl(props) {

    if (!props.synctimes.selected) {
        function onClickF(st) {
            return function () {
                props.onSyncSelected(st)
            }
        }
    
        return (<DropdownButton title="Sync" id="bg-nested-dropdown">
        {
            _.map(props.synctimes.options, st => <MenuItem key={st.name} onClick={onClickF(st)}>{st.name}</MenuItem>)
        }
        </DropdownButton>)
    }

    let stuff = [
        <span>Syncing from <DateTime value={new Date(props.synctimes.selected)}></DateTime></span>
    ]

    if (props.acked.count > 0) {
        let ackedPopover = (
            <Popover id="popover-trigger-hover-focus" title="Acknowledged">
                latest <DateTime value={new Date(props.acked.lastTimestamp)}></DateTime>
            </Popover>
        );
        stuff.push(<span>
            &nbsp;acked&nbsp;
            <ConditionalOverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={ackedPopover} visible={null != ackedPopover}>
                <Badge>{props.acked.count}</Badge>
            </ConditionalOverlayTrigger>
        </span>)
    }

    return <span>{stuff}</span>
}