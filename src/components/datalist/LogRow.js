import React, { Component } from 'react'
import { Col, Row, Badge } from 'react-bootstrap'
import _ from 'lodash'
import DateTime from '../generic/DateTime'
import '../datalist/DataList.css'
import MultilineField from '../datalist/MultilineField'
import FilterLikeThisButton from './FilterLikeThisButton'

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

        let row = this.props.data 
        let h = row.source

        let onAck= this.props.onAck ? (tillThis) => this.props.onAck(h.id, tillThis) : null

        return <Row data-test-class="log-row">
            <Col sm={3} md={3} lg={3}>
                {onAck && <AckButton onAck={onAck}/>}
                <ExpandableShevron expanded={this.state.expanded} toggle={this.toggle} />
                <DateTime value={h.timestamp} /> 
                {(row.tags||[]).map(tag => <React.Fragment key={tag}> <Badge>{tag} <AckTagButton onClick={() => this.props.onAckTag(tag)} /> </Badge></React.Fragment>)}
            </Col>
            <Col sm={9} md={9} lg={9}>{row.message || h.message}</Col>
            <ExpandableDetails expanded={this.state.expanded} data={h} onAck={onAck} watchIndex={this.props.watchIndex}/>
            </Row>
    }
}

function AckButton(props) {
    return <span 
        className="glyphicon glyphicon-ok-sign ack-button" 
        style={{cursor: 'pointer'}} 
        onClick={(e) => props.onAck(e.metaKey)} 
        title="Acknlowledge. Use cmd to ack all up to this."></span>
}

function AckTagButton(props) {
    return <span 
        className="glyphicon glyphicon-ok-sign ack-tag" 
        style={{cursor: 'pointer'}} 
        onClick={(e) => props.onClick()} 
        title="Acknlowledge the captor."></span>
}

function ExpandableShevron(props) {
    let title = props.expanded ? 'show less' : 'show less'
    let chevronDirection = props.expanded ? 'down' : 'right'
    return <span data-test-class="row-expand-collapse" className={['glyphicon', 'glyphicon-chevron-' + chevronDirection].join(' ')} 
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
                    {this.props.onAck && 
                        <span>
                            <FilterLikeThisButton value={h} watchIndex={this.props.watchIndex}/>&nbsp;
                            <button className="btn btn-default btn-xs" onClick={() => this.props.onAck(false)}><span className="glyphicon glyphicon-ok-sign"></span> ack this</button>&nbsp;
                            <button className="btn btn-default btn-xs" onClick={() => this.props.onAck(true)}><span className="glyphicon glyphicon-import"></span> ack down to this <span className="glyphicon glyphicon-ok-sign"></span></button>&nbsp;
                        </span>
                    }
                </div>
                {oneLineFields}
                {multiLineFields}
            </Col>
        </Row>
    }
}

export default LogRow