import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import _ from 'lodash'

const mapStateToProps = state => {
    return {
        watches: state.watches
    }
}

function WatchList({watches, match}) {
    
    let baseUrl = (match.url === '/' ? '' : match.url) + '/watch'

    return <ul className="list-group">
    {
        watches.map(({config, data}, i) =>
            <Link to={`${baseUrl}/${i}`} className="list-group-item" key={i} data-test-class="watch-li">
            {config.serviceName} {config.levelValue} <PendingCount data={data} />
            </Link>
        )
    }
    <Link to={`${baseUrl}/new`} className="list-group-item" data-test-id="add-watch">
            add...
            </Link>
    </ul>
}

function PendingCount({data}) {
    let count = _.size(data.timeline.pending)
    if (!count) {
        return null
    }

    return <span className="badge">{count}</span>

}

export default connect(mapStateToProps, null)(WatchList)