import React from 'react'
import { connect } from 'react-redux'
import { removeCaptor } from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        remove: () => {
            dispatch(removeCaptor(ownProps.captorKey))
        },
    }
}

function CaptureEditForm(props) {
    return <button className="btn btn-default btn-xs glyphicon glyphicon-remove" onClick={props.remove}>remove</button>
}

export default connect(null, mapDispatchToProps)(CaptureEditForm)
