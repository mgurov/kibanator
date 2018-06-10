import {connect} from 'react-redux'
import {selectWatch, resetData, stopFetchTimer} from '../../actions'

const mapStateToProps = state => {
    return {
        stateWatchIndex: state.view.watchIndex
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectWatch: (watchIndex) => {
            dispatch(stopFetchTimer())
            dispatch(resetData())
            dispatch(selectWatch({watchIndex}))
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