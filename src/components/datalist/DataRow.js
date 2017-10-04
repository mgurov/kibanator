import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import _ from 'lodash'
import DateTime from '../generic/DateTime'
import './DataList.css'
import MakeCaptorButton from '../captor/MakeCaptorButton'
import CopyToClipboardButton from '../generic/CopyToClipboardButton'

class DataRow extends Component {
    constructor(props) {
        super(props)
        this.state = { expanded: false }
        let that = this
        this.toggle = function() {
            that.setState({expanded: !that.state.expanded})
        }
        if (props.setHitMark) {
            this.toggleHitMark = () => {
                that.props.setHitMark(that.props.data, !that.props.showAsMarked)
            }
        }
        if (props.ackHit) {
            this.ack = (e) => {
                that.props.ackHit(that.props.data, e.metaKey ? 'till' : 'this')
            }
        }
    }

    render() {
        const h = this.props.data

        let {timestamp, message} = h

        let chevronDirection, expandedRow;

        function DivWithCopy({k:key, v:value}) {
            return <div key={key}><label>{key} <CopyToClipboardButton value={value} />:</label> <pre>{value}</pre></div>
        }

        if (this.state.expanded) {
            chevronDirection = 'glyphicon glyphicon-chevron-down'

            let oneLineFields = []
            let multiLineFields = []

            _.forEach(h.fields, (value, key) => {
                if (value.indexOf && value.indexOf('\n') > 0) {
                    multiLineFields.push(<DivWithCopy key={key} k={key} v={value}/>)
                } else {
                    oneLineFields.push(<span key={key}><label>{key}:</label> {value} </span>)
                }
            })

            expandedRow = <Row>
            <Col xs={12} md={12} lg={12}>
                <MakeCaptorButton hit={h} />
                {oneLineFields}    
                {multiLineFields}    
            </Col>
        </Row>
        } else {
            chevronDirection = 'glyphicon glyphicon-chevron-right'
            expandedRow = null;
        }

        let mark;
        if (this.toggleHitMark) {
            if (this.props.showAsMarked) {
                mark = <span className="glyphicon glyphicon-star" onClick={this.toggleHitMark} title="unmark"></span>
            } else {
                mark = <span className="glyphicon glyphicon-star-empty" onClick={this.toggleHitMark} title="mark"></span>
            }
        } else {
            mark = null
        }

        return <Row>
            <Col sm={3} md={3} lg={3}>
                {this.ack && <span className="glyphicon glyphicon-ok-sign" onClick={this.ack} title="Acknlowledge. Use cmd to ack all up to this."></span>}
                {mark}
                <span className={chevronDirection} onClick={this.toggle}></span>
                <DateTime value={timestamp} />
            </Col>
            <Col sm={9} md={9} lg={9}>{message}</Col>
            {expandedRow}
            </Row>
    }
}

export default DataRow