import React from 'react'
import _ from 'lodash'
import * as constant from '../../constant'
import { Grid, Row, Col, Button} from 'react-bootstrap'
import LogRow from './LogRow'


class DataList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            viewSize: constant.VIEW_SIZE,
        }
        this.showMore = (e) => {
            this.setState({viewSize: this.state.viewSize + constant.VIEW_SIZE})
        }
    }

    render() {

        let fullData = this.props.value || []
        let dataHead = _.take(fullData, this.state.viewSize)
        let remainderLength = fullData.length - dataHead.length

        return <Grid fluid={true}>
         <Row className="top-buffer">
             <Col xs={12} md={12} lg={12}>{this.props.actionButton}</Col>
         </Row>
         {dataHead.map(o =>
             <LogRow
                 key={o.id}
                 data={o}
                 onAck={this.props.onAck}
                 onAckTag={this.props.onAckTag}
                 watchIndex={this.props.watchIndex}
             />)}
         {(remainderLength > 0) && <Row className="top-buffer">
             <Col xs={12} md={12} lg={12}><Button onClick={this.showMore}>See next {constant.VIEW_SIZE} of {remainderLength} remaining</Button></Col>
         </Row>}
     </Grid>
    }
}

export default DataList