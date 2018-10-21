import React from 'react'
import { Button } from 'reactstrap'
import { showView } from '../../actions'
import { connect } from 'react-redux'
import * as constant from '../../constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapDispatchToProps = (dispatch, {watchIndex, field, value}) => {
    return {
        makeFilterLikeThis: () => {
            dispatch(showView({ key: constant.viewFilterLikeThis, hit: value, watchIndex, field }))
        },
    }
}

function FilterLikeThisButton(props) {
    return <Button 
            className="filter-like-this-button" 
            size="sm"
            title="filter"
            onClick={() => props.makeFilterLikeThis()}>
            <FontAwesomeIcon icon="filter"/>{' '}{props.children}
        </Button>
}

export default connect(null, mapDispatchToProps)(FilterLikeThisButton);