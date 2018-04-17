import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonGroup, MenuItem, DropdownButton, Checkbox } from 'react-bootstrap';
import _ from 'lodash'
import { messageContainsCaptor, messageMatchesRegexCaptor, captorToPredicate } from '../../domain/Captor'
import * as actions from '../../actions'

const mapStateToProps = state => {
    return {
        view: state.view,
        captorsNames: _.map(state.config.captors, (c) => c.key),
        hit: state.view.hit,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        applyDraftFilter: (predicate) => {
            dispatch(actions.applyDraftFilter({predicate}))
        },
        ackPredicate: (predicate) => {
            dispatch(actions.ackPredicate({predicate}))
        },
        addCaptor: (captor) => {
            dispatch(actions.addCaptor(captor))
        },
    }
}

class FilterLikeThisForm extends Component {

    constructor(props) {
        super(props)

        let existingCaptorNames = {}
        _.forEach(props.captorsNames, (c) => existingCaptorNames[c] = 1)

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
            view: 'filter', //filter or save
            predicateTested: false,
        }

        let that = this

        this.escapeRegex = () => {
            let messageContains = that.state.messageContains
                .replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")
                .replace(/\n/g, "\\n")
                .replace(/\t/g, "\\t")
            that.setState(that.addKeyUpdateIfNotChanged({ messageContains }))
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
                newState.predicateTested = false
            }

            if (name === 'key') {
                newState.keyEdited = true
            }

            that.setState(newState);
        }

        this.validateKey = (defaultProps = {}) => {
            let key = that.state.key
            if (!key) {
                return Object.assign({}, defaultProps, { help: "Should not be empty", validationState: "error" })
            }
            if (existingCaptorNames[key]) {
                return Object.assign({}, defaultProps, { help: "Captor with this name already exists", validationState: "error" })
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
                return Object.assign({}, defaultProps, { help: "Should not be empty", validationState: "error" })
            }

            let captor = that.makeCaptor()

            let predicate
            try {
                predicate = captorToPredicate(captor)
            } catch (e) {
                let help = { help: "" + e, validationState: "error" }
                return Object.assign({}, defaultProps, help)
            }

            if (!predicate.apply(this.props.hit)) {
                return Object.assign({}, defaultProps, { help: "Would not match the current message", validationState: "warning" })
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
            if (that.state.view === 'filter') {
                if (that.state.predicateTested) {
                    this.ack(event)
                } else {
                    this.dryRunMatch(event)
                }
            } else {
                this.onAddCaptor(event)
            }
        }

        this.dryRunMatch = (event) => {
            event.preventDefault();
            if (that.isInvalid()) {
                return
            }

            let filter = that.makeCaptor()
            let predicate = captorToPredicate(filter)
            that.props.applyDraftFilter(predicate)
            that.setState({predicateTested: true})
        }


        this.ack = (event) => {
            event.preventDefault();
            if (that.isInvalid()) {
                return
            }

            let filter = that.makeCaptor()
            let predicate = captorToPredicate(filter)
            that.props.ackPredicate(predicate)
            that.close()
        }

        this.onAddCaptor = (event) => {
            event.preventDefault();
            if (that.isInvalid()) {
                return
            }

            let filter = that.makeCaptor()
            that.props.addCaptor(filter)
            that.close()
        }

        this.switchViewFun = (view) => () => {
            this.setState({ view: view })
        }

        this.close = () => {
            this.props.close()
        }        
    }

    componentDidMount() {
        this.dryRunMatch({preventDefault:() => {}})
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
            this.setState(this.addKeyUpdateIfNotChanged({ field, messageContains, exampleMessage: messageContains }))
        }

        let CancelButton = () => {
            return <Button bsStyle="default"
                bsSize="small"
                onClick={this.close}
                title="Forget about this"
            >Never mind</Button>
        }

        let form;

        if (this.state.view === 'filter') {
            form = <form onSubmit={this.submit}>
                <span>&nbsp;</span>
                <FieldGroup
                    {...fieldProps("messageContains")}
                    label={<span>

                        Filter on field <DropdownButton bsSize="xsmall" bsStyle="default" id="filterFields" title={this.state.field == null ? 'Message' : this.state.field} onSelect={changeField}>
                            <MenuItem active={this.state.field == null}>Message</MenuItem>
                            <MenuItem divider />
                            {
                                _.map(this.props.hit.fields, (v, k) => <MenuItem key={k} active={this.state.field === k} eventKey={k}>{k}</MenuItem>)
                            }
                        </DropdownButton>

                        &nbsp;using&nbsp;

                        <ButtonGroup bsSize="xsmall" bsStyle="default">
                            <Button active={this.state.type === 'contains'} onClick={() => that.setState({ type: 'contains' })}>contains</Button>
                            <Button active={this.state.type === 'matches'} onClick={() => that.setState({ type: 'matches' })}>matches js regex</Button>
                        </ButtonGroup>:</span>
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

                <CancelButton />&nbsp;

                <Button bsStyle={this.state.predicateTested ? "default": "primary"}
                    bsSize="small"
                    onClick={this.dryRunMatch}
                    disabled={this.isInvalid()}
                    title="Show matching lines"
                >
                    Match
                    </Button>
                &nbsp;

                <Button bsStyle={this.state.predicateTested ? "primary": "default"}
                    bsSize="small"
                    onClick={this.ack}
                    disabled={!this.state.predicateTested}
                    title="Do not create the filter yet, just ack the currently pending lines"
                >
                    Ack Matched ({this.props.matchedCount})
                    </Button>

                <Button bsStyle="default"
                    bsSize="small"
                    onClick={this.switchViewFun('save')}
                    disabled={!this.state.predicateTested}
                    title="Create a new persistent filter of this search"
                >
                    Save as &gt;&gt;
                    </Button>

            </form>

        } else {
            form = <form onSubmit={this.submit}>

                <FieldGroup
                    {...fieldProps("key")}
                    label="Name"
                    {...this.validateKey({ help: "Should be unique. Preferably short." })}
                    autoFocus
                />

                <Checkbox checked={this.state.acknowledge} onChange={() => that.setState({ acknowledge: !that.state.acknowledge })}>
                    Acknowledge <small>untick to leave message tagged in the pending list</small>
                </Checkbox>

                <Checkbox checked={this.state.transform} onChange={() => that.setState({ transform: !that.state.transform })}>
                    Transform <small>tick to use matched field as the title. First captured group will be used for regex with captures.</small>
                </Checkbox>

                <Button bsStyle="default"
                    bsSize="small"
                    onClick={this.switchViewFun('filter')}
                    title="Back to filter"
                >
                    &lt; &lt; Back to filter
                    </Button>
                &nbsp;
                <CancelButton />
                &nbsp;
                <Button bsStyle="primary"
                    bsSize="small"
                    onClick={this.onAddCaptor}
                    disabled={this.isInvalid()}
                    title="Save me"
                >
                    OK, save this
                    </Button>


            </form>
        }

        return form;
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


export default connect(mapStateToProps, mapDispatchToProps)(FilterLikeThisForm);