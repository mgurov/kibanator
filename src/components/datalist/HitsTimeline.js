import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import {Button, ButtonGroup, Alert} from 'reactstrap'
import * as constant from '../../constant'
import _ from 'lodash'
import './DataList.css'
import EditCaptorsButton from '../captor/EditCaptorsButton'
import {viewToCaptorKey} from '../../domain/Captor'
import FilterLikeThisView from './FilterLikeThisView'
import DataList from './DataList'
import {watchIndexData} from '../../state/data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapStateToProps = (state, {watchIndex}) => {
    let data = watchIndexData(state, watchIndex)
    return {
        timeline: data.timeline,
        hitIds: data.hits.ids,
        view: state.view.key,
        viewProps: state.view,
        error: state.fetchStatus.error,
        syncStarted: !!((_.find(state.synctimes, e => e.watchIndex === watchIndex) || {}).selectedTimeRange),
        captorsCount: _.size(_.get(state, `watches[${watchIndex}].config.captors`)),
    }
}

const mapDispatchToProps = (dispatch, {watchIndex}) => {
    return {
        onAck: (id, ackAllTillThis) => {
            let a = ackAllTillThis ? actions.ackTillId : actions.ackId;
            dispatch(a({id, watchIndex}))
        },
        onAckTag: (tag) => dispatch(actions.ackTag({tag, watchIndex})) ,
        removeCaptor: (captorKey, watchIndex) => () => {
            dispatch(actions.removeCaptor({captorKey, watchIndex}))
        },
        ackAll: () => {
            dispatch(actions.ackAll({watchIndex}))
        },
        showViewClick: (key) => () => dispatch(actions.showView({key})),
    }
}


class HitsTimeline extends React.Component{ 
    render() {
        let props = this.props
        if (!props.syncStarted) {
            return null
        }

        let theView = (props.timeline[props.view]||[])
        let onAck = null
        let onAckTag = null
        let action = null
        if (props.view === constant.viewPending) {
            onAck = props.onAck
            onAckTag = props.onAckTag
            action = {
                title: <span><FontAwesomeIcon icon="check-circle"/> ack all</span>,
                action: props.ackAll,
                disabled: theView.length === 0,
            }
        }

        let captorKey = viewToCaptorKey(props.view)
        if (captorKey) {
            action = {
                title: 'remove captor',
                action: props.removeCaptor(captorKey, props.watchIndex),
            }
        }

        let view
        if (props.view === constant.viewFilterLikeThis) {
            view = <FilterLikeThisView watchIndex={props.watchIndex} close={props.showViewClick(constant.viewPending)} />
         } else {

            view = <DataList value={theView}
                    actionButton={<ActionButton action={action}/>}
                    onAck={onAck}
                    onAckTag={onAckTag}
                    watchIndex={props.watchIndex}
                />
         }


        return <span>

        {props.error &&
                    <Alert id="dataFetchErrorAlert" color="warning">
                        {props.error.name} {props.error.message}
                    </Alert>
                }

            <ViewButtons selectedView={props.view} viewCounts={_.mapValues(props.timeline, v => v.length)} showViewClick={props.showViewClick} captorsCount={props.captorsCount}/>

            <div>{view}</div>

        </span>
    }
}

function ViewButtons({selectedView, viewCounts, showViewClick, captorsCount}) {

    function DataViewButton({view, name}) {
     return <Button
            color="light"
            active={view === selectedView}
            onClick={showViewClick(view)}
            >
            {name || view} <span className="badge badge-secondary">{viewCounts[view]}</span>
            </Button>
    }

    return <ButtonGroup size="sm">
        <span className="btn"></span>
            <DataViewButton view={constant.viewPending}/>
            <DataViewButton view={constant.viewAcked}/>
        <span className="btn"></span>
            {
                _.chain(viewCounts)
                    .keys()
                    .map( k => {
                            let captorKey = viewToCaptorKey(k)
                            if (captorKey) {
                                return <DataViewButton key={k} view={k} name={captorKey}/>
                            } else {
                                return null
                            }
                        }
                    )
                    .compact()
                    .value()
            }
            <span className="btn"></span>
            {
                (captorsCount > 0) && <EditCaptorsButton/>
            }
        </ButtonGroup>

}

function ActionButton({action}) {
    return action ? <Button 
        size="sm" 
        onClick={action.action} 
        disabled={action.disabled}
        >{action.title}</Button> : null
}

export default connect(mapStateToProps, mapDispatchToProps)(HitsTimeline)