import React, { Component } from 'react';
import {Button, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import * as FormHelper from '../generic/FormHelper'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { removeCaptor } from '../../actions'
import {captorKeyToView} from '../../domain/Captor'
import {watchIndexData} from '../../state/data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const mapStateToProps = (state, {match}) => {
    let watchIndex = parseInt(match.params.watchIndex, 10)
    let captors = state.watches[watchIndex].config.captors
    return {
        watchIndex,
        captors,
        timeline:  watchIndexData(state, watchIndex).timeline,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        removeCaptor: (captor, watchIndex) => {
            dispatch(removeCaptor({captorKey: captor.key, watchIndex}))
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
            <div>
                <Modal isOpen={this.props.visible} toggle={this.props.close} onKeyDown={FormHelper.handleEnterKey(this.submit)}>
                    <ModalHeader toggle={this.props.close}>
                        Edit captors
                    </ModalHeader>

                    <ModalBody>
                        <Container fluid={true}>
                        {props.captors.map(
                            captor => 
                            <Row key={captor.key}>
                                <Col xs={2}>
                                    <Button size="sm" className="rm-filter" onClick={() => this.props.removeCaptor(captor, this.props.watchIndex)}>
                                        <FontAwesomeIcon icon="trash-alt" />
                                    </Button>
                                </Col>
                                <Col xs={10}>
                                    {captor.key} <span className="badge badge-secondary">{countCaptured(captor.key)}</span>                                 
                                </Col>
                            </Row>
                        )}
                        </Container>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={this.props.close}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );

        return modalInstance;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditCaptorsPopup));