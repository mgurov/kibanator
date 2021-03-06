import { connect } from 'react-redux'
import DocumentTitle from './DocumentTitle'
import _ from 'lodash'

const mapStateToProps = (state, {watchIndex}) => {

    let titleArray = []

    let pendingCount = _.sum(_.map(state.watches, d => _.size(d.data.timeline.pending)))
    if (pendingCount > 0) {
        titleArray.push('' + pendingCount)
    }

    if (watchIndex !== undefined) {
        let serviceName = _.get(state, `watches[${watchIndex}].config.serviceName`)
        if (serviceName) { 
            titleArray.push(serviceName)
        }
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