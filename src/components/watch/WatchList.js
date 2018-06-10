import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const mapStateToProps = state => {
    return {
        watches: state.config.watches
    }
}

function WatchList({watches, match}) {
    
    let baseUrl = (match.url === '/' ? '' : match.url) + '/watch'

    return <ul className="list-group">
    {
        watches.map((value, i) =>
            <Link to={`${baseUrl}/${i}`} className="list-group-item" key={i} data-test-class="watch-li">
            {value.serviceName} {value.levelValue}
            </Link>
        )
    }
    <Link to={`${baseUrl}/new`} className="list-group-item" data-test-id="add-watch">
            add...
            </Link>
    </ul>
}

export default connect(mapStateToProps, null)(WatchList)