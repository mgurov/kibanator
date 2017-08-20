import React from 'react'
import { DropdownButton, MenuItem, Badge, Popover, OverlayTrigger} from 'react-bootstrap'
import _ from 'lodash'
import DateTime from './DateTime'

export function SyncTimeControl(props) {

    if (props.synctimes.selected) {

        let ackedPopover = null;

        if (true) {
            ackedPopover = (
                <Popover id="popover-trigger-hover-focus" title="Acked">
                    Acked {props.acked.count} latest <DateTime value={new Date(props.acked.lastTimestamp)}></DateTime>
                </Popover>
            );
        }

        return (
            <span>Syncing from <DateTime value={new Date(props.synctimes.selected)}></DateTime>
                &nbsp;acked <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={ackedPopover}>
                    <Badge>{props.acked.count}</Badge>
                </OverlayTrigger>
            </span>)
    }

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