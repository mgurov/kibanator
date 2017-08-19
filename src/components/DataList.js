import React, { Component } from 'react'
import { Grid, Col, Row } from 'react-bootstrap'
import {flattenMap} from '../domain/maps'
import _ from 'lodash'

function Timestamp({ value }) {
    var date = new Date(value);
    return (<span title={value}>{date.toLocaleDateString() + " " + date.toLocaleTimeString()}</span>)
}

class DataRow extends Component {
    constructor(props) {
        super(props)
        this.state = { expanded: false }
        let that = this
        this.toggle = function() {
            that.setState({expanded: !that.state.expanded})
        }
    }

    render() {
        let { Timestamp: timestamp, Message: message, ...restFields } = this.props.data._source;

        let chevronDirection, expandedRow;

        if (this.state.expanded) {
            chevronDirection = 'glyphicon glyphicon-chevron-down'
            let fields = _.map(flattenMap(restFields), (value, key) => {
                return <p key={key} >{key}: {value}</p>
            })

            expandedRow = <Row>
            <Col xs={8} md={8} lg={8}>
                {fields}    
            </Col>
        </Row>
        } else {
            chevronDirection = 'glyphicon glyphicon-chevron-right'
            expandedRow = null;
        }

        return <Row>
            <Col sm={3} md={3} lg={3}>
                <span className={chevronDirection} onClick={this.toggle}></span>
                <Timestamp value={timestamp} />
            </Col>
            <Col sm={9} md={9} lg={9}>{message}</Col>
            {expandedRow}
            </Row>
    }
}

function DataList(props) {
    return (<Grid fluid={true}>
        {props.data.hits.map(o => <DataRow key={o._id} data={o} />)}
    </Grid>)
}

export default DataList;