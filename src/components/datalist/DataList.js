import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import _ from 'lodash'
import DataRow from './DataRow'
import './DataList.css'

function DataList(props) {
    let { ackTillId, data, firstRowContent, lastRowContent, ...rest } = props
    return (<Grid fluid={true}>
        <Row className="top-buffer">
            <Col xs={12} md={12} lg={12}>{firstRowContent}</Col>
        </Row>
        {_.map(data, o =>
            <DataRow
                key={o.id}
                data={o}
                {...rest}
            />)}
        <Row className="top-buffer">
            <Col xs={12} md={12} lg={12}>{lastRowContent}</Col>
        </Row>
    </Grid>)
}

export default DataList;