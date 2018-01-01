import React, { Component } from 'react';
import { Button, Modal, Grid, Row, Col} from 'react-bootstrap';
import * as FormHelper from '../generic/FormHelper'

import { connect } from 'react-redux'
import { removeCaptor } from '../../actions'
import {captorKeyToView} from '../../domain/Captor'


const mapStateToProps = state => {
    return {
        captors: state.config.captors,
        timeline: state.data.timeline,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        removeCaptor: (captor) => {
            dispatch(removeCaptor(captor.key))
        },
    }
}


class EditCaptorsPopup extends Component {

    constructor(props) {
        super(props)

        let that = this

        this.submit = (event) => {
            event.preventDefault();
            if (that.isInvalid()) {
                return
            }

            that.props.onSave(that.makeCaptor())
            that.props.close()
        }
    }

    render() {

        let props = this.props

        function countCaptured(captorKey) {
            let captured = props.timeline[captorKeyToView(captorKey)]
            return captured && captured.length
        }

        const modalInstance = (
            <span className="static-modal">
                <Modal show={this.props.visible} onHide={this.props.close} onKeyDown={FormHelper.handleEnterKey(this.submit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit captors</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Grid fluid={true}>
                        {props.captors.map(
                            captor => 
                            <Row key={captor.key}>
                                <Col xs={2}>
                                    <button className="btn btn-default btn-xs glyphicon glyphicon-remove" onClick={() => this.props.removeCaptor(captor)}></button>
                                </Col>
                                <Col xs={10}>
                                    {captor.key} <span className="badge">{countCaptured(captor.key)}</span>                                 
                                </Col>
                            </Row>
                        )}
                        </Grid>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        );

        return modalInstance;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCaptorsPopup);