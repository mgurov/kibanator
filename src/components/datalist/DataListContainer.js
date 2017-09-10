import React from 'react'
import { connect } from 'react-redux'
import { fetchData, selectSyncTime, ackTillId, toggleFavorite, ackAll, startFetching } from '../../actions'
import DataList from './DataList'
import { Alert } from 'react-bootstrap'
import { SyncTimeControl } from './SyncTimeControl'
import _ from 'lodash'
import { ViewSize } from './const.js'
import { SelectTimeRange } from '../timerange/SelectTimeRange'
import CapturesLine from '../capture/CapturesLine'

const mapStateToProps = state => {
    return {
        data: state.data,
        synctimes: state.synctimes,
        config: state.config,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDataAsked: () => {
            dispatch(fetchData())
        },
        onSyncSelected: (st, config) => {
            dispatch(selectSyncTime(st))
            let from = new Date(st.nowToStart(new Date()))
            dispatch(startFetching(from, config))
        },
        ackTillId: (id) => {
            dispatch(ackTillId(id))
        },
        ackAll: () => {
            dispatch(ackAll())
        },
        toggleFavorite: (id) => {
            dispatch(toggleFavorite(id))
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

    let syncControl
    if (props.synctimes.selected) {

        syncControl = <SyncTimeControl
            selected={props.synctimes.selected}
            acked={props.data.data.acked}
            pendingCount={props.data.data.hits.length}
            lastSync={props.data.lastSync}
            ackAll={props.ackAll}
        />
    } else {
        syncControl = <SelectTimeRange options={props.synctimes.options} onSelected={st => props.onSyncSelected(st, props.config)} />
    }

    let toShow = _.take(props.data.data.hits, ViewSize)

    return (<div>
        {syncControl}
        <CapturesLine value={props.data.data.captures} />
        {error}
        <DataList data={toShow} ackTillId={props.ackTillId} toggleFavorite={props.toggleFavorite} />
    </div>)
}

let WatchListContainer = connect(mapStateToProps, mapDispatchToProps)(DataListContainer)

export default WatchListContainer