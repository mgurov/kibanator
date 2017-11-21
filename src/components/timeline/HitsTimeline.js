import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => {
    return {
        timeline: state.data.timeline,
        hitIds: state.data.hits.ids,
    }
}

function HitsTimeline(props) {
    return <span>ids: ${props.hitIds.length}, timeline: {props.timeline.length}</span>
}

export default connect(mapStateToProps)(HitsTimeline)