import React from 'react'
import { Button } from 'react-bootstrap'
import { showView } from '../../actions'
import { connect } from 'react-redux'
import * as constant from '../../constant'

const mapDispatchToProps = (dispatch, {watchIndex, field, value}) => {
    return {
        makeFilterLikeThis: () => {
            dispatch(showView({ key: constant.viewFilterLikeThis, hit: value, watchIndex, field }))
        },
    }
}

function FilterLikeThisButton(props) {
    return <Button 
            className="btn btn-default btn-xs filter-like-this-button" 
            title="filter"
            onClick={() => props.makeFilterLikeThis()}>
            <span className="glyphicon glyphicon-filter"></span> {props.children}
        </Button>
}

export default connect(null, mapDispatchToProps)(FilterLikeThisButton);