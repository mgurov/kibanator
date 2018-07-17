import React from 'react'

import { connect } from 'react-redux'

import FilterLikethisForm from '../captor/FilterLikeThisForm'

import DataList from './DataList'

import {watchIndexData} from '../../state/data'

const mapStateToProps = (state, {watchIndex}) => {
    return {
        filterLikeThis: watchIndexData(state, watchIndex).timeline.filterLikeThis,
    }
}

function FilterLikeThisView(props) {
    return <span>

        <FilterLikethisForm close={props.close} matchedCount={(props.filterLikeThis || []).length} watchIndex={props.watchIndex} />

        <DataList value={props.filterLikeThis}/>

     </span>
}

export default connect(mapStateToProps)(FilterLikeThisView)