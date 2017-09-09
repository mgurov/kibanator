import React from 'react'
import { addCaptor } from '../../actions'
import MakeCaptorPopup from './MakeCaptorPopup'
import { connect } from 'react-redux'
import { messageContainsCaptor } from '../../domain/Captor'

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
        this.onSave = ({ key, messageContains }) => {
            this.props.addCaptor(messageContainsCaptor(key, messageContains))
        }
    }
    render() {
        if (this.state.popupVisible) {
            return <MakeCaptorPopup
                visible={this.state.popupVisible}
                close={this.togglePopupVisibility}
                onSave={this.onSave}
                hit={this.props.hit}
            ></MakeCaptorPopup>
        } else {
            return <div><button className="btn btn-default btn-xs" onClick={this.togglePopupVisibility}>make captor</button></div>
        }
    }
}

let MakeCaptorButton = connect(mapStateToProps, mapDispatchToProps)(MakeCaptorButtonComponent)


export default MakeCaptorButton
