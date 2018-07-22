import {connect} from 'react-redux'
import {resetData, stopFetchTimer} from '../../actions'

const mapStateToProps = state => {
    return {
        stateWatchIndex: state.view.watchIndex
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectWatch: () => {
            dispatch(stopFetchTimer())
            dispatch(resetData())
        }
    }
}

function OnWatchSelected({watchIndex, stateWatchIndex, selectWatch}) {
    if (watchIndex !== stateWatchIndex) {
        selectWatch(watchIndex)
    }
    return null
}

export default connect(mapStateToProps, mapDispatchToProps)(OnWatchSelected)