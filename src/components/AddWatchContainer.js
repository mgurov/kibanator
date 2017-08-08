import React, { Component } from 'react';
import EditWatchForm from './EditWatchForm'

import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { addWatch } from '../actions'

class AddWatchContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false
        }

        let that = this

        this.toggleState = function () {
            that.setState({ active: !that.state.active })
        }

        this.onSave = function (name) {
            props.dispatch(addWatch(name))
            that.toggleState();
        }
    }

    render() {
        return (
            <span>
                <EditWatchForm
                    visible={this.state.active}
                    onClose={this.toggleState}
                    onSave={this.onSave}
                />
                <Button onClick={this.toggleState}>++</Button>
            </span>)
    }
}

AddWatchContainer = connect()(AddWatchContainer)

export default AddWatchContainer