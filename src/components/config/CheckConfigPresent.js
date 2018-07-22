import React from 'react'
import _ from 'lodash'
import {Redirect} from 'react-router-dom'

import {connect} from 'react-redux'

let mapStateToProps = (state) => ({
    configPresent: _.size(state.watches) > 0
})

function CheckConfigPresent({configPresent}) {
    if (configPresent) {
        return null
    } else {
        return <Redirect to="/watch/new" />
    }
}

export default connect(mapStateToProps)(CheckConfigPresent)