import React from 'react'
import { withRouter } from 'react-router-dom'
import { setConfig, removeConfig } from '../../../actions'
import { connect } from 'react-redux'
import PasteJson from './PasteJson'
import EditConfigForm from './EditConfigForm';
import { Button } from 'reactstrap'
import FilterList from '../FilterList'
import _ from 'lodash'
import NavTabs from '../../generic/NavTabs';

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
    return { watches: state.watches }
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

        let value = !this.index ? defaultConfig : props.watches[this.index].config

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

        let onFilterRemove = (key) => {
            this.setState({
                values: { ...this.state.values, captors: _.filter(this.state.values.captors, c => c.key !== key) }
            })
        }

        return <div>Edit configuration&nbsp;
            <Button color="primary"
                onClick={onSubmit}
                data-test-id="save-config"
                title="Save the changes"
            >Save</Button> {' '}

            <Button color="danger"
                onClick={onRemove}
                data-test-id="rm-watch"
                title="Remove"
            >Remove</Button>

            <NavTabs>
                {[
                    {
                        title: 'Form',
                        content: <EditConfigForm {...{ values: this.state.values, onChange, onSubmit }} />
                    },
                    {
                        title: 'Filters',
                        content: <FilterList value={this.state.values.captors} onRemove={onFilterRemove} />
                    },
                    {
                        title: 'Source',
                        content: <PasteJson value={this.state.values} onJsonEdited={(values) => this.setState({ values })} />
                    },
                ]}
            </NavTabs>
        </div>
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditConfig))