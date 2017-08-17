import React from 'react'
import { connect } from 'react-redux'
import { fetchData, selectSyncTime } from '../actions'
import DataList from './DataList'
import { Alert } from 'react-bootstrap'
import {SyncTimeControl} from './SyncTimeControl'

const mapStateToProps = state => {
    return {
        data: state.data,
        synctimes: state.synctimes
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDataAsked: () => {
            dispatch(fetchData())
        },
        onSyncSelected: (st) => {
            dispatch(selectSyncTime(st))
        },
    }
}

function DataListContainer(props) {

    let error = null;
    if (props.data.error) {
        error = (<Alert bsStyle="warning">
            {props.data.error.name} {props.data.error.message}
        </Alert>)
    }

    return (<div>
        <SyncTimeControl synctimes={props.synctimes} onSyncSelected={props.onSyncSelected}/>
        {error}
        <DataList data={props.data.data} />
    </div>)
}

let WatchListContainer = connect(mapStateToProps, mapDispatchToProps)(DataListContainer)

export default WatchListContainer