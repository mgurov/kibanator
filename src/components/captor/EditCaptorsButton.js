import React from 'react'
import EditCaptorsPopup from './EditCaptorsPopup'
import {Button} from 'reactstrap'

class EditCaptorsButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = { popupVisible: false }
        let that = this
        this.togglePopupVisibility = () => {
            that.setState({ popupVisible: !that.state.popupVisible })
        }
    }
    render() {
        if (this.state.popupVisible) {
            return <EditCaptorsPopup
                visible={this.state.popupVisible}
                close={this.togglePopupVisibility}
            ></EditCaptorsPopup>
        } else {
            return <Button size="sm" color="light" onClick={this.togglePopupVisibility}>edit filters</Button>
        }
    }
}

export default EditCaptorsButton
