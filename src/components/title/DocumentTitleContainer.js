import { connect } from 'react-redux'
import DocumentTitle from './DocumentTitle'
import _ from 'lodash'
import {selectedData} from '../../state/data'

const mapStateToProps = state => {
    let titleArray = []

    let pendingCount = (selectedData(state, true).timeline.pending || []).length
    if (pendingCount > 0) {
        titleArray.push('' + pendingCount)
    }

    let watchIndex = _.get(state, 'view.watchIndex')
    let serviceName = _.get(state, `config.watches[${watchIndex}].serviceName`)
    if (serviceName) { 
        titleArray.push(serviceName)
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