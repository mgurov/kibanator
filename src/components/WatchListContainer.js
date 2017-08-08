import { connect } from 'react-redux'
import {editWatch, deleteWatch} from '../actions'
import WatchList from './WatchList'

const mapStateToProps = state => {
  return {
    watches: state.watches
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onWatchEdited: (id, text) => {
      dispatch(editWatch(text, id))
    },
    onWatchDeleted: (id, text) => {
      dispatch(deleteWatch(id))
    },
  }
}

let WatchListContainer = connect(mapStateToProps, mapDispatchToProps)(WatchList)

export default WatchListContainer