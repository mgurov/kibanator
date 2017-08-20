import React from 'react'
import {DropdownButton, MenuItem} from 'react-bootstrap'
import _ from 'lodash'
import DateTime from './DateTime'

export function SyncTimeControl(props) {

    if (props.synctimes.selected) {
        return (<span>Syncing from <DateTime value={new Date(props.synctimes.selected)}></DateTime> removed {props.acked} </span>)
    }

    function onClickF(st) {
        return function() {
            props.onSyncSelected(st)
        }
    }

    return (<DropdownButton title="Sync" id="bg-nested-dropdown">
        {
            _.map(props.synctimes.options, st => <MenuItem key={st.name} onClick={onClickF(st)}>{st.name}</MenuItem>)
        }
    </DropdownButton>)
}