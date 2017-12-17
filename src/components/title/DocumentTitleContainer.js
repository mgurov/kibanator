import { connect } from 'react-redux'
import DocumentTitle from './DocumentTitle'

const mapStateToProps = state => {
    let title = state.config.serviceName
    let pending = state.data.timeline.pending || {}
    let pendingCount = (pending.records||[]).length + pending.moreToShow
    if (pendingCount > 0) {
        title += ' - ' + pendingCount
    }
    const error = state.fetchStatus.error
    if (error) {
        title += ' - error fetching ' + error
    }
    return {
        title,
    }
}

const DocumentTitleContainer = connect(mapStateToProps)(DocumentTitle)
export default DocumentTitleContainer