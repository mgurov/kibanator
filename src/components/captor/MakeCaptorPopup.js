import React, { Component } from 'react';
import { Button, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class MakeCaptorPopup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            key: '', //todo: derive from the message?
            messageContains: this.props.hit.message,
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

        this.submit = (event) => {
            event.preventDefault();
            that.props.onSave(this.state)
            that.props.close()
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
                        <form onSubmit={this.submit}>

                            <FieldGroup
                                {...fieldProps("key")}
                                label="Name"
                                help="should be unique"
                                autoFocus
                            />

                            <FieldGroup
                                {...fieldProps("messageContains")}
                                label="@message contains" //TODO: take the field from the config actually
                            />

                            <HelpBlock>{this.props.hit.message}</HelpBlock>

                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
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


export default MakeCaptorPopup;