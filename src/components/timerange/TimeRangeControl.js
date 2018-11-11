import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../actions'
import { SyncTimeControl } from './SyncTimeControl'
import { SelectTimeRange } from './SelectTimeRange'
import Reset from './Reset'
import _ from 'lodash'
import {Card, CardBody, CardTitle, CardSubtitle} from 'reactstrap'

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


function TimeRangeControl({synctimes, watchIndex, fetchStatus, onSyncSelected, config}) {
    let fetchedWatchIndexes = synctimes.fetchedWatchIndexes;

    if (_.size(fetchedWatchIndexes) > 0) {
        let fetchingCurrentWatch = (_.indexOf(fetchedWatchIndexes, watchIndex) >= 0)
        if (!fetchingCurrentWatch) {
            return <div className="bg-warning">Other watches are being fetched.  
                { }<Reset>Reset data</Reset> or <a target="_blank" href="#open-me-new-window">open in new window</a> to start with this one.
            </div>
        }
    }
    
    if (synctimes.selected) {    
        return <SyncTimeControl
            selected={synctimes.selected}
            syncIntervalId={synctimes.intervalId}
            lastSync={fetchStatus.lastSync}
        />
    } else {
        return <div>
            
            <Card className="text-center">
                <CardBody>
                    <CardTitle>Ready to go</CardTitle>
                    <CardSubtitle>Please select where do we start from:</CardSubtitle>
                    <SelectTimeRange 
                    onSelected={st => onSyncSelected(st, config)} 
                    />
                </CardBody>
            </Card>

            
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeRangeControl)