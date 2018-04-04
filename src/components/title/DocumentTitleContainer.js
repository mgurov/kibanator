import { connect } from 'react-redux'
import DocumentTitle from './DocumentTitle'

const mapStateToProps = state => {
    let titleArray = []

    let pendingCount = (state.data.timeline.pending || []).length
    if (pendingCount > 0) {
        titleArray.push('' + pendingCount)
    }

    if (state.config.serviceName) {
        titleArray.push(state.config.serviceName)
    }

    let error = state.fetchStatus.error
    if (error) {
        titleArray.push(' - error fetching ' + error)
    }

    let title = titleArray.join(" - ")

    return {
        title,
    }
}

const DocumentTitleContainer = connect(mapStateToProps)(DocumentTitle)
export default DocumentTitleContainer