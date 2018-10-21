import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, 
    ButtonGroup,
    UncontrolledButtonDropdown,DropdownMenu, DropdownToggle, DropdownItem,
    Input, Label, FormGroup, FormText
} from 'reactstrap'
import _ from 'lodash'
import { messageContainsCaptor, messageMatchesRegexCaptor, captorToPredicate } from '../../domain/Captor'
import * as actions from '../../actions'
import {withRouter} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapStateToProps = (state, {watchIndex}) => {
    let selectedConfigWatch = state.watches[watchIndex].config
    return {
        view: state.view,
        captorsNames: _.map(selectedConfigWatch.captors, (c) => c.key), 
        hit: state.view.hit,
        field: state.view.field,
    }
}

const mapDispatchToProps = (dispatch, {watchIndex}) => {
    return {
        applyDraftFilter: (predicate) => {
            dispatch(actions.applyDraftFilter({predicate, watchIndex}))
        },
        ackPredicate: (predicate) => {
            dispatch(actions.ackPredicate({predicate, watchIndex}))
        },
        addCaptor: (captor) => {
            dispatch(actions.addCaptor({captor, watchIndex}))
        },
    }
}

class FilterLikeThisForm extends Component {

    constructor(props) {
        super(props)

        this.watchIndex = props.watchIndex

        let existingCaptorNames = {}
        _.forEach(props.captorsNames, (c) => existingCaptorNames[c] = 1)

        let {field, hit} = props

        const exampleMessage = field ?  hit.fields[props.field] : hit.message

        this.state = {
            key: exampleMessage,
            keyEdited: false,
            messageContains: exampleMessage,
            type: 'contains',
            field,
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

        this.close = (event) => {
            if (event) {
                event.preventDefault();
            }
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
            return <Button
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

                        Filter on field 

                        <UncontrolledButtonDropdown size="sm" id="filterFields">
                            <DropdownToggle caret>{this.state.field == null ? 'Message' : this.state.field}</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem active={this.state.field == null}>Message</DropdownItem>
                                <DropdownItem divider />
                                {
                                    _.map(this.props.hit.fields, (v, k) => <DropdownItem key={k} active={this.state.field === k} onClick={() => changeField(k)}>{k}</DropdownItem>)
                                }
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>

                        &nbsp;using&nbsp;

                        <ButtonGroup size="sm">
                            <Button active={this.state.type === 'contains'} onClick={() => that.setState({ type: 'contains' })}>contains</Button>
                            <Button active={this.state.type === 'matches'} onClick={() => that.setState({ type: 'matches' })}>matches js regex</Button>
                        </ButtonGroup>:</span>
                    }
                    autoFocus
                    {...this.validateMessageContains()}
                />

                {this.state.type === 'matches' &&
                    <FormText><p>e.g. <code>Hello \d+ world</code> to match <code>Hello 12 world</code></p>
                        <p><Button size="sm" color="primary" onClick={this.escapeRegex}>escape the filter</Button> 
                        {' '}<a target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp" title=""><FontAwesomeIcon icon="book"/> MDN</a></p>
                    </FormText>
                }
                <FormText>{this.state.exampleMessage}</FormText>

                <CancelButton />&nbsp;

                <Button color={this.state.predicateTested ? "secondary": "primary"}
                    onClick={this.dryRunMatch}
                    disabled={this.isInvalid()}
                    title="Show matching lines"
                >
                    Match
                    </Button>
                &nbsp;

                <Button color={this.state.predicateTested ? "secondary": "primary"}
                    onClick={this.ack}
                    disabled={!this.state.predicateTested}
                    title="Do not create the filter yet, just ack the currently pending lines"
                >
                    Ack Matched ({this.props.matchedCount})
                    </Button>

                <Button
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

                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" checked={this.state.acknowledge} onChange={() => that.setState({ acknowledge: !that.state.acknowledge })} />{' '}
                        Acknowledge <small>untick to leave message tagged in the pending list</small>
                    </Label>
                </FormGroup>


                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" checked={this.state.transform} onChange={() => that.setState({ transform: !that.state.transform })} />{' '}
                        Transform <small>tick to use matched field as the title. First captured group will be used for regex with captures.</small>
                    </Label>
                </FormGroup>


                <Button
                    onClick={this.switchViewFun('filter')}
                    title="Back to filter"
                >
                    &lt; &lt; Back to filter
                    </Button>
                &nbsp;
                <CancelButton />
                &nbsp;
                <Button color="primary"
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

function FieldGroup({label, help, validationState, ...rest }) {
    return (
        <FormGroup>
            <Label>{label}</Label>
            <Input {...rest} />
            {help && <FormText>{help}</FormText>}
        </FormGroup>
    );
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterLikeThisForm));