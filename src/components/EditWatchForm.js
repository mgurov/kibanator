import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class EditWatchForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: props.text || "",
            disabled: true
        }

        this.onChange = (event) => {
            this.setState({
                name: event.target.value,
                disabled: !event.target.value
            })
        }

        this.submit = (event) => {
            event.preventDefault();
            if (!this.state.disabled) {
                this.props.onSave(this.state.name)
                this.setState({ name: "" })
            }
        }
    }

    render() {

        const modalInstance = (
            <div className="static-modal">
                <Modal show={this.props.visible} onHide={this.props.onClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add an entry</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={this.submit}>

                            <FieldGroup
                                id="name"
                                type="text"
                                label="Name"
                                placeholder="Enter name"
                                value={this.state.name}
                                onChange={this.onChange}
                                autoFocus
                            />
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.onClose}>Close</Button>
                        {this.props.onDelete ? <Button onClick={this.props.onDelete}>Delete</Button> : null}
                        <Button bsStyle="primary" disabled={this.state.disabled} onClick={this.submit}>Save changes</Button>
                    </Modal.Footer>

                </Modal>
            </div>
        );

        return modalInstance;
    }
}

EditWatchForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    text: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onSave: PropTypes.func.isRequired
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

export default EditWatchForm;