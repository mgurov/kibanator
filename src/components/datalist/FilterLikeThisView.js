import React from 'react'

import { connect } from 'react-redux'

import FilterLikethisForm from '../captor/FilterLikeThisForm'

import DataList from './DataList'

import {selectedData} from '../../state/data'

const mapStateToProps = state => {
    return {
        filterLikeThis: selectedData(state).timeline.filterLikeThis,
    }
}

function FilterLikeThisView(props) {
    return <span>

        <FilterLikethisForm close={props.close} matchedCount={(props.filterLikeThis || []).length} />

        <DataList value={props.filterLikeThis}/>

     </span>
}

export default connect(mapStateToProps)(FilterLikeThisView)