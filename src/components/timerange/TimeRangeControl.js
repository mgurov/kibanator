import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../actions'
import { SyncTimeControl } from './SyncTimeControl'
import { SelectTimeRange } from './SelectTimeRange'
import Reset from './Reset'
import _ from 'lodash'

const mapStateToProps = (state, {watchIndex}) => {
    return {
        data: state.data,
        fetchStatus: state.fetchStatus,
        synctimes: state.synctimes,
        config: state.watches[watchIndex].config,
    }
}

const mapDispatchToProps = (dispatch, {watchIndex}) => {
    return {
        onSyncSelected: (st, config) => {
            dispatch(actions.selectSyncTime(st))
            let from = new Date(st.nowToStart(new Date()))
            dispatch(actions.startFetching({from, config, watchIndex}))
        },
    }
}


function TimeRangeControl(props) {
    let fetchedWatchIndexes = props.synctimes.fetchedWatchIndexes;

    if (_.size(fetchedWatchIndexes) > 0) {
        let fetchingCurrentWatch = (_.indexOf(fetchedWatchIndexes, props.watchIndex) >= 0)
        if (!fetchingCurrentWatch) {
            return <div className="bg-warning">Other watches are being fetched.  
                { }<Reset>Reset data</Reset> or <a target="_blank" href="#open-me-new-window">open in new window</a> to start with this one.
            </div>
        }
    }
    
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