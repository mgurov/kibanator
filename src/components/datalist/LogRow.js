import React, { Component } from 'react'
import {Col, Row, Button, Badge} from 'reactstrap'
import _ from 'lodash'
import DateTime from '../generic/DateTime'
import './DataList.css'
import LogRowFieldValue from '../datalist/LogRowFieldValue'
import FilterLikeThisButton from './FilterLikeThisButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

        return <div data-test-class="log-row">
            <Row className="cursor-pointer" onClick={this.toggle}>
                <Col sm={3} md={3} lg={3} >
                    {onAck && <AckButton onAck={onAck}/>}{' '}
                    <ExpandableShevron expanded={this.state.expanded} />{' '}
                    <DateTime value={h.timestamp} className="text-nowrap" /> 
                    {(row.tags||[]).map(tag => <React.Fragment key={tag}> <Badge>{tag} <AckTagButton onClick={() => this.props.onAckTag(tag)} /> </Badge></React.Fragment>)}
                </Col>
                <Col sm={9} md={9} lg={9}>{row.message || h.message}</Col>
            </Row>
            <Row>
                <ExpandableDetails expanded={this.state.expanded} data={h} onAck={onAck} watchIndex={this.props.watchIndex}/>
            </Row>
            </div>
    }
}

function AckButton(props) {
    return <span 
        className="ack-button cursor-pointer" 
        onClick={(e) => props.onAck(e.metaKey)} 
        title="Acknlowledge. Use cmd to ack all up to this."><FontAwesomeIcon icon="check-circle"/></span>
}

function AckTagButton(props) {
    return <span 
        className="ack-tag cursor-pointer" 
        onClick={(e) => props.onClick()} 
        title="Acknlowledge the captor."><FontAwesomeIcon icon="check-circle"/></span>
}

function ExpandableShevron(props) {
    let title = props.expanded ? 'show less' : 'show less'
    let chevronDirection = props.expanded ? 'down' : 'right'
    return <span data-test-class="row-expand-collapse" 
        className="cursor-pointer"
        title={title} ><FontAwesomeIcon icon={`chevron-${chevronDirection}`} /></span>
}

class ExpandableDetails extends Component {
    render() {
        if (!this.props.expanded) {
            return null
        }
        const h = this.props.data
        let fields = _.map(h.fields, (value, fieldName) => {
            return {
                multiline: value.indexOf && value.indexOf('\n') > 0,
                fieldName,
                value,
            }
        })
        
        fields = _.sortBy(fields, 'multiline')

        let filterLikeThisFieldButton = (fieldName) => <FilterLikeThisButton value={h} field={fieldName} watchIndex={this.props.watchIndex}/>

        return <Row>
            <Col xs={12} md={12} lg={12}>
                <div>
                    {this.props.onAck && 
                        <span>
                            <FilterLikeThisButton value={h} watchIndex={this.props.watchIndex}>Filter...</FilterLikeThisButton>&nbsp;
                            <Button size="sm" color="light" onClick={() => this.props.onAck(false)}><FontAwesomeIcon icon="check-circle"/> ack this</Button>&nbsp;
                            <Button size="sm" color="light" onClick={() => this.props.onAck(true)}><FontAwesomeIcon icon="check-double"/> ack down to this</Button>&nbsp;
                        </span>
                    }
                </div>
                {
                    fields.map(f => <LogRowFieldValue {...f} key={f.fieldName} filterButton={filterLikeThisFieldButton(f.fieldName)} />)
                }
            </Col>
        </Row>
    }
}

export default LogRow