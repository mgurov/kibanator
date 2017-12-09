import React from 'react'
import { addCaptor } from '../../actions'
import MakeCaptorPopup from './MakeCaptorPopup'
import { connect } from 'react-redux'

const mapStateToProps = state => {
    return {
        captors: state.config.captors,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addCaptor: (captor) => {
            dispatch(addCaptor(captor))
        },
    }
}

class MakeCaptorButtonComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = { popupVisible: false }
        let that = this
        this.togglePopupVisibility = () => that.setState({ popupVisible: !that.state.popupVisible })
    }
    render() {
        if (this.state.popupVisible) {
            return <MakeCaptorPopup
                visible={this.state.popupVisible}
                close={this.togglePopupVisibility}
                onSave={this.props.addCaptor}
                hit={this.props.hit}
                captors={this.props.captors}
            ></MakeCaptorPopup>
        } else {
            return <button className="btn btn-default btn-xs" onClick={this.togglePopupVisibility}>make captor</button>
        }
    }
}

let MakeCaptorButton = connect(mapStateToProps, mapDispatchToProps)(MakeCaptorButtonComponent)


export default MakeCaptorButton
