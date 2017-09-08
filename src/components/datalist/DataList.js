import React, { Component } from 'react'
import { Grid, Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import DateTime from '../generic/DateTime'
import './DataList.css'

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

        let {timestamp, message} = h

        let chevronDirection, expandedRow;

        if (this.state.expanded) {
            chevronDirection = 'glyphicon glyphicon-chevron-down'

            let oneLineFields = []
            let multiLineFields = []

            _.forEach(h.fields, (value, key) => {
                if (value.indexOf && value.indexOf('\n') > 0) {
                    multiLineFields.push(<div key={key}><label>{key}:</label> <pre>{value}</pre></div>)
                } else {
                    oneLineFields.push(<span key={key}><label>{key}:</label> {value}</span>)
                }
            })

            expandedRow = <Row>
            <Col xs={12} md={12} lg={12}>
                {oneLineFields}    
                {multiLineFields}    
            </Col>
        </Row>
        } else {
            chevronDirection = 'glyphicon glyphicon-chevron-right'
            expandedRow = null;
        }

        let starClass = (h.favorite) ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty'

        return <Row>
            <Col sm={3} md={3} lg={3}>
                <span className="glyphicon glyphicon-ok" onClick={this.props.removeTillThis} title="remove everything down to and including this"></span>
                <span className={starClass} onClick={this.props.toggleFavorite} title="save this"></span>
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
        {_.map(props.data, o => <DataRow 
            key={o.id} 
            data={o} 
            removeTillThis={() => props.ackTillId(o.id)}
            toggleFavorite={() => props.toggleFavorite(o.id)}
             />)}
    </Grid>)
}

export default DataList;