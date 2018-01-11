import React from 'react'
import {Button} from 'react-bootstrap'
import { connect } from 'react-redux'

import { stopFetchTimer, resetData } from '../../actions'

const mapStateToProps = state => {
    return {
        fetchStarted: !!state.synctimes.selected,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        reset: (config) => {
            dispatch(stopFetchTimer())
            dispatch(resetData())
        },
    }
}

function ResetButton(props) {
    return <Button 
        className="btn btn-xs glyphicon glyphicon-repeat" 
        onClick={props.reset}
        disabled={!props.fetchStarted}
        title="Reset"
    />
}

let Reset = connect(mapStateToProps, mapDispatchToProps)(ResetButton)

export default Reset