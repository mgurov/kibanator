import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import * as FormHelper from '../generic/FormHelper'

class EditConfigPopup extends Component {

    constructor(props) {
        super(props)
        this.state = Object.assign({}, {
            timeField: '',
            messageField: '',
            serviceField: '',
            serviceName: '',
            levelField: '',
            levelValue: '',
            index: '',
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

        let props = this.props
        let that = this

        function fieldProps(id) {
            return {
                id,
                value: that.state[id],
                onChange: that.onChange,
                disabled: props.disabled,
                type: "text",
            }
        }

        const modalInstance = (
            <span className="static-modal">
                <Modal show={true} onHide={this.props.disableCancel ? undefined: this.props.close} onKeyDown={FormHelper.handleEnterKey(this.submit)}>
                    <Modal.Header closeButton={!this.props.disableCancel}>
                        <Modal.Title>{props.disabled ? 'Inspect' : 'Edit'} configuration</Modal.Title>
                        {
                            props.disabled ? <HelpBlock>Configuration cannot be changed when fetching data. Refresh the page to adjust.</HelpBlock> : null
                        }
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={this.submit}>

                            <FieldGroup
                                {...fieldProps("timeField") }
                                label="Time Field"
                                help="e.g. @timestamp"
                            />

                            <FieldGroup
                                {...fieldProps("messageField") }
                                label="Message Field"
                                help="e.g. @message"
                            />

                            <FieldGroup
                                {...fieldProps("serviceField") }
                                label="Service Field"
                                help="e.g. @fields.application"
                            />

                            <FieldGroup
                                {...fieldProps("serviceName") }
                                label="Service Name"
                                help="e.g. wps or webfrontend. Comma separates."
                                autoFocus
                            />

                            <FieldGroup
                                {...fieldProps("levelField") }
                                label="Level Field"
                                help="e.g. @fields.level"
                            />

                            <FieldGroup
                                {...fieldProps("levelValue") }
                                label="Level"
                                help="e.g. ERROR, WARN, INFO or DEBUG. Comma separates."
                            />

                            <FieldGroup
                                {...fieldProps("index") }
                                label="Index"
                                help="e.g. logstash-pro-log4json-*"
                            />

                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.close} disabled={this.props.disableCancel}>Close</Button>
                        <Button bsStyle="primary"
                            onClick={this.submit}
                            disabled={this.props.disabled}
                            title="Save the changes"
                        >
                            Save changes
                        </Button>
                    </Modal.Footer>

                </Modal>
            </span>
        );

        return modalInstance;
    }
}

function FieldGroup({ id, label, help, ...rest }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...rest} />
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