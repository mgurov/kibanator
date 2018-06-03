import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import EditConfigPopup from './EditConfigPopup'

class EditConfigButton extends Component {
    constructor(props) {
        super(props)
        this.state = {editorVisible: this.props.unitialized}
        let that = this
        this.toggleEditor = () => that.setState({editorVisible: !that.state.editorVisible})
    }

    render() {
        if (this.state.editorVisible) {
            return (<EditConfigPopup 
                config={this.props.config}
                close={this.toggleEditor}
                onSave={this.props.setConfig}
                disabled={this.props.fetchStarted}
                disableCancel={this.props.unitialized}
             />)
        } else {
            return (<Button 
                className="btn btn-xs glyphicon glyphicon-wrench" 
                data-test-id="edit-config"
                onClick={this.toggleEditor}
                />)
        }
    }
}

export default EditConfigButton