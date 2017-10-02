import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { ButtonGroup, Button, Alert } from 'react-bootstrap'

import * as actions from '../../actions'

import DataList from './DataList'
import AndNMoreNoPagingExplained from './AndNMoreNoPagingExplained'

const mapStateToProps = state => {
    return {
        data: state.data.data,
        error: state.data.fetchStatus.error,
        view: viewToKey(state.view),
        syncStarted: !!state.synctimes.selected,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showViewClick: (key) => () => dispatch(actions.showView(keyToView(key))),
        ackHit: (h, mode) => {
            if (mode === 'till') {
                dispatch(actions.ackTillId(h.id))
            } else {
                dispatch(actions.ackId(h.id))
            }
        },
        ackAll: () => {
            dispatch(actions.ackAll())
        },
        setHitMark: (hit, marked) => {
            if (marked) {
                dispatch(actions.markHit(hit.id))
            } else {
                dispatch(actions.unmarkHit(hit.id))
            }
        },
        removeCaptor: (captorKey) => () => {
            dispatch(actions.removeCaptor(captorKey))
        },
    }
}

function DataListContainer(props) {

    if (!props.syncStarted) {
        return null
    }

    let pendingView = {
        name: 'Pending',
        key: 'pending',
        dataKey: 'hits',
        ackHit: props.ackHit,
        setHitMark: props.setHitMark,
        actions: [
            {
                title: 'ack all',
                action: props.ackAll,
                disabled: props.data.hits.length === 0,
            }
        ]
    }

    let stdViews = [
        pendingView,
        {
            name: 'Marked',
            key: 'marked',
            setHitMark: props.setHitMark,
            showAsMarked: true,
        },
        {
            name: 'Acked',
            key: 'acked',
        },
    ]
    let captureViews = _.map(props.data.captures, (v, k) => {
        return {
            name: k,
            key: `captures.${k}`,
            actions: [
                {
                    title: 'remove',
                    action: props.removeCaptor(k),
                }
            ]
        }
    }
    )

    function buttons(views) {
        return _.map(views, toButton(props))
    }

    let currentView = _.find(stdViews.concat(captureViews), ["key", props.view])
    if (!currentView) {
        throw new Error('Could not find view:' + props.view)
    }
    const viewSize = 100
    let allViewData = viewData(currentView, props.data)
    let hiddenItemsCount = Math.max(0, allViewData.length - viewSize)
   
    return <div>
        <ButtonGroup bsSize="xsmall" bsStyle="default">
            {buttons(stdViews)}
            <span className="btn"></span>
            {buttons(captureViews)}
        </ButtonGroup>
        {props.error &&
            <Alert id="dataFetchErrorAlert" bsStyle="warning">
                {props.error.name} {props.error.message}
            </Alert>
        }
        <div>
        
        </div>
        <DataList 
            data={_.take(allViewData, viewSize)} 
            ackHit={currentView.ackHit} 
            setHitMark={currentView.setHitMark} 
            showAsMarked={currentView.showAsMarked}
            firstRowContent={(currentView.actions || []).map( a => 
            <Button 
                bsSize="xsmall" 
                bsStyle="default" 
                key={'current-view-action-' + a.action} 
                onClick={a.action} 
                disabled={a.disabled}
                >{a.title}</Button>
        )}
            lastRowContent={
                <AndNMoreNoPagingExplained count={hiddenItemsCount}/>
            }
        />
    </div>
}


function viewData(view, data) {
    return _.get(data, view.dataKey || view.key)
}

let toButton = (props) => (v) => {
    return <Button
        key={v.key}
        active={v.key === props.view}
        onClick={props.showViewClick(v.key)}
    >
        {v.name} <span className="badge">{viewData(v, props.data).length}</span>
    </Button>
}

function keyToView(key) {
    if (key.indexOf('captures.') === 0) {
        return {
            type: 'capture',
            captorKey: key.substring('captures.'.length),
        }
    } else {
        return { type: key }
    }
}

function viewToKey(view) {
    if (view.type === 'capture') {
        return 'captures.' + view.captorKey
    } else {
        return view.type
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataListContainer)