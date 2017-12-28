import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { Grid, Row, Col, Button, ButtonGroup, Alert, Well } from 'react-bootstrap'
import LogRow from './LogRow'
import * as constant from '../../constant'
import _ from 'lodash'
import './DataList.css'

const mapStateToProps = state => {
    return {
        timeline: state.data.timeline,
        hitIds: state.data.hits.ids,
        view: state.view.key,
        error: state.fetchStatus.error,
        syncStarted: !!state.synctimes.selected,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAck: (id, ackAllTillThis) => {
            let a = ackAllTillThis ? actions.ackTillId : actions.ackId;
            dispatch(a(id))
        },
        removeCaptor: (captorKey) => () => {
            dispatch(actions.removeCaptor(captorKey))
        },
        ackAll: () => {
            dispatch(actions.ackAll())
        },
        showViewClick: (key) => () => dispatch(actions.showView({key})),
    }
}


class HitsTimeline extends React.Component{ 
    constructor(props) {
        super(props)
        this.state = { viewSize: constant.VIEW_SIZE, }
        let that = this
        this.showMore = (e) => {
            that.setState({ viewSize: that.state.viewSize + constant.VIEW_SIZE})
        }
    }

    render() {
        let props = this.props
        if (!props.syncStarted) {
            return <Well>Right, select where to start from ^^^</Well>
        }

        let theView = (props.timeline[props.view]||[])
        let data = _.take(theView, this.state.viewSize)
        let remainderLength = theView.length - data.length
        let onAck = null
        let action = null
        if (props.view === constant.viewPending) {
            onAck = props.onAck
            action = {
                title: <span><span className="glyphicon glyphicon-ok-sign"></span> ack all</span>,
                action: props.ackAll,
                disabled: data.length === 0,
            }
        }

        if (props.view.indexOf(constant.viewCapturePrefix) === 0) {
            action = {
                title: 'remove captor',
                action: props.removeCaptor(props.view.substring(constant.viewCapturePrefix.length)),
            }
        }

        return <span>

        {props.error &&
                    <Alert id="dataFetchErrorAlert" bsStyle="warning">
                        {props.error.name} {props.error.message}
                    </Alert>
                }


            <ViewButtons selectedView={props.view} viewCounts={_.mapValues(props.timeline, v => v.length)} showViewClick={props.showViewClick}/>

            <Grid fluid={true}>
            <Row className="top-buffer">
                <Col xs={12} md={12} lg={12}><ActionButton action={action}/></Col>
            </Row>
            {data.map(o =>
                <LogRow
                    key={o.id}
                    data={o}
                    onAck={onAck}
                />)}
            {(remainderLength > 0) && <Row className="top-buffer">
                <Col xs={12} md={12} lg={12}><Button onClick={this.showMore}>See next {constant.VIEW_SIZE} of {remainderLength} remaining</Button></Col>
            </Row>}
        </Grid>
        </span>
    }
}

function ViewButtons({selectedView, viewCounts, showViewClick}) {

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
                            if (k.indexOf(constant.viewCapturePrefix) === 0) {
                                let captureName = k.substring(constant.viewCapturePrefix.length)
                                return <DataViewButton key={k} view={k} name={captureName}/>
                            } else {
                                return null
                            }
                        }
                    )
                    .compact()
                    .value()
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