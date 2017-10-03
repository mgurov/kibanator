import { connect } from 'react-redux'
import DocumentTitle from './DocumentTitle'

const mapStateToProps = state => {
    let title = state.config.serviceName
    const pendingCount = state.data.data.hits.length
    if (pendingCount > 0) {
        title += ' - ' + pendingCount
    }
    const error = state.data.fetchStatus.error
    if (error) {
        title += ' - error fetching ' + error
    }
    return {
        title,
    }
}

const DocumentTitleContainer = connect(mapStateToProps)(DocumentTitle)
export default DocumentTitleContainer