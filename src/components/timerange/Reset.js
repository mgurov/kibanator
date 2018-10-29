import React from 'react'
import {Button} from 'reactstrap'
import { connect } from 'react-redux'

import { stopFetchTimer, resetData } from '../../actions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const mapStateToProps = state => {
    return {
        fetchStarted: !!state.synctimes.selected,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        reset: () => {
            dispatch(stopFetchTimer())
            dispatch(resetData())
        },
    }
}

function ResetButton(props) {
    return <Button
        size="sm" 
        color="light"
        data-test-id="reset"
        onClick={props.reset}
        disabled={!props.fetchStarted}
        title="Reset"
    >
        <FontAwesomeIcon icon="sync" />
    </Button>
}

let Reset = connect(mapStateToProps, mapDispatchToProps)(ResetButton)

export default Reset