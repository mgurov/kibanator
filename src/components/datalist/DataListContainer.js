import React from 'react'
import { connect } from 'react-redux'
import { fetchData, selectSyncTime, ackTillId, ackId, markHit, unmarkHit, ackAll, startFetching } from '../../actions'
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
        ackHit: (h, mode) => {
            if (mode === 'till') {
                dispatch(ackTillId(h.id))
            } else {
                dispatch(ackId(h.id))
            }
        },
        ackAll: () => {
            dispatch(ackAll())
        },
        setHitMark: (hit, marked) => {
            if (marked) {
                dispatch(markHit(hit.id))
            } else {
                dispatch(unmarkHit(hit.id))
            }
        }
    }
}

function DataListContainer(props) {

    let error = null;
    if (props.data.fetchStatus.error) {
        error = (<Alert id="dataFetchErrorAlert" bsStyle="warning">
            {props.data.fetchStatus.error.name} {props.data.fetchStatus.error.message}
        </Alert>)
    }

    let syncControl
    if (props.synctimes.selected) {

        syncControl = <SyncTimeControl
            selected={props.synctimes.selected}
            acked={props.data.data.acked}
            pendingCount={props.data.data.hits.length}
            lastSync={props.data.fetchStatus.lastSync}
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
        <DataList data={props.data.data.marked} setHitMark={props.setHitMark} showAsMarked={true} />
        { props.data.data.marked.length > 0 && <hr/> }
        <DataList data={toShow} ackHit={props.ackHit} setHitMark={props.setHitMark} showAsMarked={false}/>
    </div>)
}

let WatchListContainer = connect(mapStateToProps, mapDispatchToProps)(DataListContainer)

export default WatchListContainer