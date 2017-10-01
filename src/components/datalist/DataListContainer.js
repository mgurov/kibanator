import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { ButtonGroup, Button, Alert, Well } from 'react-bootstrap'
import { showView } from '../../actions/'
import DataList from '../datalist/DataList'
import * as actions from '../../actions'

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
        showViewClick: (key) => () => dispatch(showView(keyToView(key))),
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
                <HiddenItems count={hiddenItemsCount}/>
            }
        />
    </div>
}

class HiddenItems extends React.Component {

    constructor(props) {
        super(props)
        this.state = {show:false}
        let that = this
        this.toggle = (e) => {
            e.preventDefault()
            that.setState({show: !that.state.show})
        } 
    }

    render() {
        let {count} = this.props
        if (count <= 0) {
            return null
        }
    
        return <div>
            <em>And {count} <a href="#readMore" onClick={this.toggle}>more...<span className="caret"></span></a></em>
            {this.state.show &&
            <Well>
                  <button type="button" className="close" aria-label="Close" onClick={this.toggle}><span aria-hidden="true">&times;</span></button>
                  <p>Why do we not show more? 
                  Kibanator helps you to react on events in <abbr title="First In First Out" className="initialism">FIFO</abbr> manner. Like your mail inbox.
                  For other use cases you would probably switch to more suitable tools. Think kibana (which kibanator isn't supposed to replace fully).
                  </p><p>
                  Drop us a line with a good counter-example for kibanator to support paging.
                  </p>
            </Well>
            }
        </div>
    }
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