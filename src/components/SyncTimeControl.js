import React from 'react'
import {DropdownButton, MenuItem} from 'react-bootstrap'
import _ from 'lodash'

export function SyncTimeControl(props) {

    if (props.synctimes.selected) {
        return (<span>Syncing from {new Date(props.synctimes.selected) + ""}</span>)
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