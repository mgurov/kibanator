import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { Button, ButtonGroup, Alert, Well } from 'react-bootstrap'
import * as constant from '../../constant'
import _ from 'lodash'
import './DataList.css'
import EditCaptorsButton from '../captor/EditCaptorsButton'
import {viewToCaptorKey} from '../../domain/Captor'
import FilterLikeThisView from './FilterLikeThisView'
import DataList from './DataList'
import {watchIndexData} from '../../state/data'

const mapStateToProps = (state, {watchIndex}) => {
    let data = watchIndexData(state, watchIndex)
    return {
        timeline: data.timeline,
        hitIds: data.hits.ids,
        view: state.view.key,
        viewProps: state.view,
        error: state.fetchStatus.error,
        syncStarted: !!state.synctimes.selected,
        captorsCount: _.size(_.get(state, `config.watches[${watchIndex}].captors`)),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAck: (id, ackAllTillThis) => {
            let a = ackAllTillThis ? actions.ackTillId : actions.ackId;
            dispatch(a(id))
        },
        onAckTag: (tag) => dispatch(actions.ackTag(tag)) ,
        removeCaptor: (captorKey, watchIndex) => () => {
            dispatch(actions.removeCaptor({captorKey, watchIndex}))
        },
        ackAll: () => {
            dispatch(actions.ackAll())
        },
        showViewClick: (key) => () => dispatch(actions.showView({key})),
    }
}


class HitsTimeline extends React.Component{ 
    render() {
        let props = this.props
        if (!props.syncStarted) {
            return <Well>Right, select where to start from ^^^</Well>
        }

        let theView = (props.timeline[props.view]||[])
        let onAck = null
        let onAckTag = null
        let action = null
        if (props.view === constant.viewPending) {
            onAck = props.onAck
            onAckTag = props.onAckTag
            action = {
                title: <span><span className="glyphicon glyphicon-ok-sign"></span> ack all</span>,
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
                    <Alert id="dataFetchErrorAlert" bsStyle="warning">
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
            active={view === selectedView}
            onClick={showViewClick(view)}
            >
            {name || view} <span className="badge">{viewCounts[view]}</span>
            </Button>
    }

    return <ButtonGroup bsSize="xsmall" bsStyle="default">
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
        bsSize="xsmall" 
        bsStyle="default" 
        onClick={action.action} 
        disabled={action.disabled}
        >{action.title}</Button> : null
}

export default connect(mapStateToProps, mapDispatchToProps)(HitsTimeline)