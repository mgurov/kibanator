import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import DateTime from '../generic/DateTime'
import '../datalist/DataList.css'
import MakeCaptorButton from '../captor/MakeCaptorButton'
import MultilineField from '../datalist/MultilineField'

class LogRow extends Component {
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

        let onAck=(tillThis) => this.props.onAck(h.id, tillThis)

        return <Row>
            <Col sm={3} md={3} lg={3}>
                <AckButton onAck={onAck}/>
                <ExpandableShevron expanded={this.state.expanded} toggle={this.toggle} />
                <DateTime value={h.timestamp} /> 
            </Col>
            <Col sm={9} md={9} lg={9}>{h.message}</Col>
            <ExpandableDetails expanded={this.state.expanded} data={this.props.data} onAck={onAck}/>
            </Row>
    }
}

function AckButton(props) {
    return <span 
        className="glyphicon glyphicon-ok-sign" 
        style={{cursor: 'pointer'}} 
        onClick={(e) => props.onAck(e.metaKey)} 
        title="Acknlowledge. Use cmd to ack all up to this."></span>
}

function ExpandableShevron(props) {
    let title = props.expanded ? 'show less' : 'show less'
    let chevronDirection = props.expanded ? 'down' : 'right'
    return <span className={'glyphicon glyphicon-chevron-' + chevronDirection} 
        style={{cursor: 'pointer'}} //TODO: make external .css
        onClick={props.toggle}
        title={title} ></span>
}

class ExpandableDetails extends Component {
    render() {
        if (!this.props.expanded) {
            return null
        }
        const h = this.props.data
        let oneLineFields = []
        let multiLineFields = []

        _.forEach(h.fields, (value, key) => {
            if (value.indexOf && value.indexOf('\n') > 0) {
                multiLineFields.push(<MultilineField key={key} k={key} v={value}/>)
            } else {
                oneLineFields.push(<span key={key}><label>{key}:</label> {value} </span>)
            }
        })

        return <Row>
            <Col xs={12} md={12} lg={12}>
                <div>
                    <MakeCaptorButton hit={h} />&nbsp;
                    <button className="btn btn-default btn-xs" onClick={() => this.props.onAck(false)}>ack</button>&nbsp;
                    <button className="btn btn-default btn-xs" onClick={() => this.props.onAck(true)}>ack all up to this</button>
                </div>
                {oneLineFields}    
                {multiLineFields}    
            </Col>
        </Row>
    }
}

export default LogRow