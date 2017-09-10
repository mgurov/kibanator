import React, { Component } from 'react';
import { Button, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import _ from 'lodash'

class MakeCaptorPopup extends Component {

    constructor(props) {
        super(props)

        let existingCaptorNames = {}
        _.forEach(props.captors, (c) => existingCaptorNames[c.key] = 1)

        const exampleMessage = this.props.hit.message

        this.state = {
            key: exampleMessage,
            messageContains: exampleMessage,
        }

        let that = this

        this.onChange = (event) => {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.id;
            that.setState({
                [name]: value
            });
        }

        this.validateKey = (defaultProps = {}) => {
            let key = that.state.key
            if (!key) {
                return Object.assign({}, defaultProps, {help: "Should not be empty", validationState: "error"}) 
            }
            if (existingCaptorNames[key]) {
                return Object.assign({}, defaultProps, {help: "Captor with this name already exists", validationState: "error"}) 
            }
            return defaultProps
        }

        this.validateMessageContains = (defaultProps = {}) => {
            let value = that.state.messageContains
            if (!value) {
                return Object.assign({}, defaultProps, {help: "Should not be empty", validationState: "error"}) 
            }
            if (exampleMessage.indexOf(value) === -1) {
                return Object.assign({}, defaultProps, {help: "Would not match current message", validationState: "warning"}) 
            }
            return defaultProps
        }

        this.isInvalid = () => {
            if (that.validateKey().validationState === 'error') {
                return true;
            }
            if (that.validateMessageContains().validationState === 'error') {
                return true;
            }
            return false;
        }

        this.submit = (event) => {
            event.preventDefault();
            if (that.isInvalid()) {
                return
            }
            that.props.onSave(this.state)
            that.props.close()
        }

        this.onKeyPress = (e) => {
            //somehow it doesn't cause form submit this dialog. Did better in other ones. Ok, some manual work. 
            if ((e.keyCode === 13) && (e.target.type !== "textarea")) {
                that.submit(e)
            }
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
                <Modal show={this.props.visible} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Make captor</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={this.submit} onKeyDown={this.onKeyPress}>

                            <FieldGroup
                                {...fieldProps("key") }
                                label="Name"
                                autoFocus
                                {...this.validateKey({help: "Should be unique. Preferably short."})}
                            />

                            <FieldGroup
                                {...fieldProps("messageContains") }
                                label="@message contains" //TODO: take the field from the config actually
                                {...this.validateMessageContains()}
                            />

                            <HelpBlock>{this.props.hit.message}</HelpBlock>

                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                        <Button bsStyle="primary"
                            onClick={this.submit}
                            disabled={this.isInvalid()}
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

function FieldGroup({ id, label, help, validationState, ...rest }) {
    return (
        <FormGroup controlId={id} validationState={validationState}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...rest} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}


export default MakeCaptorPopup;