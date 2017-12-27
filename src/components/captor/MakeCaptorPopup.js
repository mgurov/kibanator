import React, { Component } from 'react';
import { Button, Modal, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonGroup, MenuItem, DropdownButton, Checkbox } from 'react-bootstrap';
import _ from 'lodash'
import * as FormHelper from '../generic/FormHelper'
import { messageContainsCaptor, messageMatchesRegexCaptor, captorToPredicate } from '../../domain/Captor'

const showTransformingFields = !!process.env.REACT_APP_TRANSFORM_FEATURE

class MakeCaptorPopup extends Component {

    constructor(props) {
        super(props)

        let existingCaptorNames = {}
        _.forEach(props.captors, (c) => existingCaptorNames[c.key] = 1)

        const exampleMessage = this.props.hit.message

        this.state = {
            key: exampleMessage,
            keyEdited: false,
            messageContains: exampleMessage,
            type: 'contains',
            field: null,
            exampleMessage,
            acknowledge: true,
            transform: false,
        }

        let that = this

        this.escapeRegex = () => {
            let messageContains = that.state.messageContains
                .replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")
                .replace(/\n/g, "\\n")
                .replace(/\t/g, "\\t")
            that.setState(that.addKeyUpdateIfNotChanged({messageContains}))
        }

        this.addKeyUpdateIfNotChanged = (state) => {
            if (!that.state.keyEdited && state.messageContains) {
                state.key = state.messageContains
            }
            return state
        }

        this.onChange = (event) => {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.id;
            
            let newState = {
                [name]: value
            }
            
            if (name === 'messageContains') {
                that.addKeyUpdateIfNotChanged(newState)
            }
            
            if (name === 'key') {
                newState.keyEdited = true
            }

            that.setState(newState);
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

        this.makeCaptor = () => {
            let state = that.state
            let result
            if (state.type === 'contains') {
                result = messageContainsCaptor(state.key, state.messageContains, state.field)
            } else {
                result = messageMatchesRegexCaptor(state.key, state.messageContains, state.field)
            }
            result.acknowledge = state.acknowledge
            if (state.transform && state.field) {
                result.messageField = state.field
            }
            return result
        }

        this.validateMessageContains = (defaultProps = {}) => {
            let value = that.state.messageContains
            if (!value) {
                return Object.assign({}, defaultProps, {help: "Should not be empty", validationState: "error"})
            }

            let captor = that.makeCaptor()

            let predicate
            try {
                predicate = captorToPredicate(captor)
            } catch (e) {
                let help = {help: "" + e, validationState: "error"}
                return Object.assign({}, defaultProps, help)
            }

            if (!predicate.apply(this.props.hit)) {
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

            that.props.onSave(that.makeCaptor())
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

        let changeField = field => {
            let messageContains = field == null ? props.hit.message : props.hit.fields[field]
            this.setState(this.addKeyUpdateIfNotChanged({field, messageContains, exampleMessage: messageContains}))
        }

        const modalInstance = (
            <span className="static-modal">
                <Modal show={this.props.visible} onHide={this.props.close} onKeyDown={FormHelper.handleEnterKey(this.submit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Make captor</Modal.Title>
                        <HelpBlock>Captor is a client-side filter that captures log lines to unclutter the pending view</HelpBlock>
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={this.submit}>

                            <FieldGroup
                                {...fieldProps("key") }
                                label="Name"
                                {...this.validateKey({help: "Should be unique. Preferably short."})}
                            />

                            <FieldGroup
                                {...fieldProps("messageContains") }
                                label={<span>
                                    
                                    <DropdownButton bsSize="xsmall" bsStyle="default" id="filterFields" title={this.state.field == null ? 'Message' : this.state.field} onSelect={changeField}>
                                        <MenuItem active={this.state.field == null}>Message</MenuItem>
                                        <MenuItem divider />
                                        {
                                            _.map(this.props.hit.fields, (v, k) => <MenuItem key={k} active={this.state.field===k} eventKey={k}>{k}</MenuItem> )
                                        }
    </DropdownButton>
                                    
                                    <ButtonGroup bsSize="xsmall" bsStyle="default">
            <Button active={this.state.type === 'contains'} onClick={() => that.setState({type:'contains'})}>contains</Button>
            <Button active={this.state.type === 'matches'} onClick={() => that.setState({type:'matches'})}>matches js regex</Button>
        </ButtonGroup></span>
                                }
                                autoFocus
                                {...this.validateMessageContains()}
                            />

                            {this.state.type === 'matches' && 
                                <HelpBlock ><p>e.g. <code>Hello \d+ world</code> to match <code>Hello 12 world</code></p>
                                <p><Button bsSize="xsmall" bsStyle="default" onClick={this.escapeRegex}>escape the filter</Button> <a className="glyphicon glyphicon-education" target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp" title="">MDN</a></p>
                                </HelpBlock>
                            }
                            <HelpBlock>{this.state.exampleMessage}</HelpBlock>

                            {showTransformingFields && <Checkbox checked={this.state.acknowledge} onChange={() => that.setState({acknowledge: !that.state.acknowledge})}>
                                Acknowledge
                            </Checkbox>}

                            {showTransformingFields && <Checkbox checked={this.state.transform} onChange={() => that.setState({transform: !that.state.transform})}>
                                Transform
                            </Checkbox>}

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