import React from 'react'
import { connect } from 'react-redux'
import { fetchData } from '../actions'
import DataList from './DataList'
import { Alert } from 'react-bootstrap'

const mapStateToProps = state => {
    return {
        data: state.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDataAsked: (id, text) => {
            dispatch(fetchData())
        }
    }
}

function DataListContainer(props) {

    let error = null;
    if (props.data.error) {
        error = (<Alert bsStyle="warning">
            {props.data.error.name} {props.data.error.message}
        </Alert>)
    }

    return (<div>
        <button onClick={props.onDataAsked} disabled={props.data.isFetching} className="btn btn-default">Sync</button>
        {error}
        <DataList data={props.data.data} />
    </div>)
}

let WatchListContainer = connect(mapStateToProps, mapDispatchToProps)(DataListContainer)

export default WatchListContainer