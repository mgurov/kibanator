import React from 'react'
import { connect } from 'react-redux'
import { fetchData, selectSyncTime, removeTillId } from '../../actions'
import DataList from './DataList'
import { Alert } from 'react-bootstrap'
import {SyncTimeControl} from './SyncTimeControl'
import _ from 'lodash'

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
        removeTillId: (id) => {
            dispatch(removeTillId(id))
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

    let toShow = _.take(props.data.data.hits, 20)

    return (<div>
        <SyncTimeControl 
            synctimes={props.synctimes} 
            acked={props.data.data.acked} 
            shown={toShow.length} 
            notAcked={props.data.data.hits.length} 
            onSyncSelected={props.onSyncSelected}
            />
        {error}
        <DataList data={toShow} removeTillId={props.removeTillId} />
    </div>)
}

let WatchListContainer = connect(mapStateToProps, mapDispatchToProps)(DataListContainer)

export default WatchListContainer