import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { Grid, Row, Col } from 'react-bootstrap'
import LogRow from './LogRow'

const mapStateToProps = state => {
    return {
        timeline: state.data.timeline,
        hitIds: state.data.hits.ids,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAck: (id, ackAllTillThis) => {
            let a = ackAllTillThis ? actions.ackTillId : actions.ackId;
            dispatch(a(id))
        },
    }
}


function HitsTimeline(props) {
    return <span>    <Grid fluid={true}>
        <Row className="top-buffer">
            <Col xs={12} md={12} lg={12}>ids: {props.hitIds.length}, timeline: {props.timeline.length}</Col>
        </Row>
        {props.timeline.map(o =>
            <LogRow
                key={o.id}
                data={o.source}
                onAck={props.onAck}
            />)}
        <Row className="top-buffer">
            <Col xs={12} md={12} lg={12}>footer</Col>
        </Row>
    </Grid>
    </span>
}

export default connect(mapStateToProps, mapDispatchToProps)(HitsTimeline)