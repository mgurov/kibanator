import React, { Component } from 'react';
import { Button, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { deleteWatch, addWatch, editWatch } from '../actions'
import { connect } from 'react-redux'

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

//TODO: rename to the EditWatchDialog?
class EditWatch extends Component {

  constructor(props) {
    super(props)
    this.state = { name: props.watch.text, disabled: true }
    this.onCancel = () => this.props.onClose()
    const thisId = props.watch.id
    const dispatch = props.dispatch
    if (thisId) {
      this.delete = () => {
        dispatch(deleteWatch(thisId));
        this.props.onClose()
      }
    }

    this.save = () => {
      let action
      if (thisId) {
        action = editWatch(this.state.name, thisId) 
      } else {
        action = addWatch(this.state.name)
      }
      dispatch(action)
      this.props.onClose()
    }

    this.onChange = (event) => {
      this.setState(Object.assign({}, this.state, {
        name: event.target.value,
        disabled: !event.target.value
      }))
    }

    this.onSubmit = (event) => {
      event.preventDefault();
      if (!this.state.disabled) {
        this.save()
      }
    }
  }

  render() {

    const modalInstance = (
      <div className="static-modal">
        <Modal show={true} onHide={this.onCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Add an entry</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={this.onSubmit}>

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
            <Button onClick={this.onCancel}>Close</Button>
            {this.delete ? <Button onClick={this.delete}>Delete</Button> : null}
            <Button bsStyle="primary" disabled={this.state.disabled} onClick={this.save}>Save changes</Button>
          </Modal.Footer>

        </Modal>
      </div>
    );

    return modalInstance;
  }
}

EditWatch = connect()(EditWatch)

export default EditWatch;
