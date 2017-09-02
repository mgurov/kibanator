import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class EditConfigPopup extends Component {

    constructor(props) {
        super(props)
        this.state = Object.assign({}, {
            timeField:'', 
            serviceField:'', 
            serviceName:'', 
            levelField:'',
            levelValue:'',
            index:'',
        }, props.config)
        
        this.onChange = (event) => {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.id;
            this.setState({
                [name]: value
            });
        }

        this.submit = (event) => {
            event.preventDefault();
            this.props.onSave(this.state)
            this.props.close()
        }
    }

    render() {

        const modalInstance = (
            <span className="static-modal">
                <Modal show={true} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit configuration</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={this.submit}>

                            <FieldGroup
                                id="timeField"
                                type="text"
                                label="Time Field"
                                help="e.g. @timestamp"
                                value={this.state.timeField}
                                onChange={this.onChange}
                                autoFocus
                            />

                            <FieldGroup
                                id="serviceField"
                                type="text"
                                label="Service Field"
                                help="e.g. @fields.application"
                                value={this.state.serviceField}
                                onChange={this.onChange}
                            />

                            <FieldGroup
                                id="serviceName"
                                type="text"
                                label="Service Name"
                                help="e.g. wps or webfrontende"
                                value={this.state.serviceName}
                                onChange={this.onChange}
                            />

                            <FieldGroup
                                id="levelField"
                                type="text"
                                label="Level Field"
                                help="e.g. @fields.level"
                                value={this.state.levelField}
                                onChange={this.onChange}
                            />

                            <FieldGroup
                                id="levelValue"
                                type="text"
                                label="Level"
                                help="e.g. ERROR, WARN, INFO or DEBUG"
                                value={this.state.levelValue}
                                onChange={this.onChange}
                            />

                            <FieldGroup
                                id="index"
                                type="text"
                                label="Index"
                                help="e.g. logstash-tst-log4json-*"
                                value={this.state.index}
                                onChange={this.onChange}
                            />

                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                        <Button bsStyle="primary" onClick={this.submit}>Save changes</Button>
                    </Modal.Footer>

                </Modal>
            </span>
        );

        return modalInstance;
    }
}

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

EditConfigPopup.propTypes = {
    config: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
}


export default EditConfigPopup;