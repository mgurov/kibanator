import React, { Component } from 'react'
import { Grid, Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import DateTime from '../generic/DateTime'

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
        const h = this.props.data

        let timestamp = h.getTimestamp()
        let message = h.getMessage()

        let chevronDirection, expandedRow;

        if (this.state.expanded) {
            chevronDirection = 'glyphicon glyphicon-chevron-down'
            let fields = _.map(h.getFields(), (value, key) => {
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
                <span className="glyphicon glyphicon-ok" onClick={this.props.removeTillThis} title="remove everything down to and including this"></span>
                <span className={chevronDirection} onClick={this.toggle}></span>
                <DateTime value={timestamp} />
            </Col>
            <Col sm={9} md={9} lg={9}>{message}</Col>
            {expandedRow}
            </Row>
    }
}

function DataList(props) {
    return (<Grid fluid={true}>
        {_.map(props.data, o => <DataRow key={o.id} data={o} removeTillThis={() => props.removeTillId(o.id)} />)}
    </Grid>)
}

export default DataList;