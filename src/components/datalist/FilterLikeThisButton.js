import React from 'react'
import { Button } from 'react-bootstrap'
import { showView } from '../../actions'
import { connect } from 'react-redux'
import * as constant from '../../constant'

const mapDispatchToProps = (dispatch, {watchIndex}) => {
    return {
        makeFilterLikeThis: (hit) => {
            dispatch(showView({ key: constant.viewFilterLikeThis, hit, watchIndex }))
        },
    }
}

function FilterLikeThisButton(props) {
    return <Button 
        className="btn btn-default btn-xs" 
        onClick={() => props.makeFilterLikeThis(props.value)}>Filter...</Button>
}

export default connect(null, mapDispatchToProps)(FilterLikeThisButton);