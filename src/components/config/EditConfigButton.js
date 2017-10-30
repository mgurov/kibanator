import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import EditConfigPopup from './EditConfigPopup'

class EditConfigButton extends Component {
    constructor(props) {
        super(props)
        this.forceShow = this.props.unitialized
        this.state = {editorVisible: this.forceShow}
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
                disableCancel={this.forceShow}
             />)
        } else {
            return (<Button 
                className="btn btn-xs glyphicon glyphicon-wrench" 
                onClick={this.toggleEditor}
                />)
        }
    }
}

export default EditConfigButton