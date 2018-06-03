import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../actions'
import { SyncTimeControl } from './SyncTimeControl'
import { SelectTimeRange } from './SelectTimeRange'

const mapStateToProps = state => {
    return {
        data: state.data,
        fetchStatus: state.fetchStatus,
        synctimes: state.synctimes,
        config: state.config,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSyncSelected: (st, config) => {
            dispatch(actions.selectSyncTime(st))
            let from = new Date(st.nowToStart(new Date()))
            dispatch(actions.startFetching(from, config))
        },
    }
}


function TimeRangeControl(props) {
    if (props.synctimes.selected) {    
        return <SyncTimeControl
            selected={props.synctimes.selected}
            syncIntervalId={props.synctimes.intervalId}
            lastSync={props.fetchStatus.lastSync}
        />
    } else {
        return <div><h4>Select where to start from:</h4> <SelectTimeRange 
                options={props.synctimes.options} 
                onSelected={st => props.onSyncSelected(st, props.config)} 
                /></div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeRangeControl)