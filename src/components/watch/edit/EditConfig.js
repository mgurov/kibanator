import React from 'react'
import { withRouter } from 'react-router-dom'
import { setConfig, removeConfig } from '../../../actions'
import { connect } from 'react-redux'
import PasteJson from './PasteJson'
import EditConfigForm from './EditConfigForm';
import { Tabs, Tab, Button } from 'react-bootstrap'

const defaultConfig = {
    timeField: '@timestamp',
    messageField: '@message',
    serviceField: '@fields.application',
    serviceName: 'yourAppHere',
    levelField: '@fields.level',
    levelValue: 'ERROR',
    index: 'logstash-pro-log4json-*',
    captors: []
}

const mapStateToProps = state => {
    return { watches: state.config.watches }
}

const mapDispatchToProps = dispatch => {
    return {
        setConfig: ({ index, value }) => {
            dispatch(setConfig({ index, value }))
        },
        removeConfig: (watchIndex) => {
            dispatch(removeConfig({ watchIndex }))
        },
    }
}

class EditConfig extends React.Component {
    constructor(props) {
        super(props)

        this.index = props.watchIndex
        this.history = props.history

        let value = !this.index ? defaultConfig : props.watches[this.index]

        this.state = {
            values: { ...value },
        }
    }

    render() {

        let onChange = (name, value) => {
            this.setState({
                values: { ...this.state.values, [name]: value }
            })
        }

        let onSubmit = (e) => {
            e.preventDefault()
            this.props.setConfig({
                index: this.index,
                value: this.state.values,
            })
            this.history.push("/")
        }

        let onRemove = () => {
            this.props.removeConfig(this.index)
            this.history.push("/")
        }

        return <div>Edit configuration&nbsp;
            <Button bsStyle="primary"
                onClick={onSubmit}
                data-test-id="save-config"
                title="Save the changes"
            >Save</Button> {' '}

            <Button bsStyle="danger"
                onClick={onRemove}
                data-test-id="rm-watch"
                title="Remove"
            >Remove</Button>

            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Form">
                    <EditConfigForm {...{ values: this.state.values, onChange, onSubmit }} />
                </Tab>
                <Tab eventKey={2} title="Source">
                    <PasteJson value={this.state.values} onJsonEdited={(values) => this.setState({ values })} />
                </Tab>
            </Tabs>

        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditConfig))