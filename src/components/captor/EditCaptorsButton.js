import React from 'react'
import EditCaptorsPopup from './EditCaptorsPopup'

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
            return <button className="btn btn-default btn-xs" onClick={this.togglePopupVisibility}>edit filters</button>
        }
    }
}

export default EditCaptorsButton
