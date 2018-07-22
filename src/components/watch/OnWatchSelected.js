import {connect} from 'react-redux'
import {resetData, stopFetchTimer} from '../../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        selectWatch: () => {
            dispatch(stopFetchTimer())
            dispatch(resetData())
        }
    }
}

function OnWatchSelected({watchIndex, selectWatch}) {
    selectWatch(watchIndex)
    return null
}

export default connect(null, mapDispatchToProps)(OnWatchSelected)