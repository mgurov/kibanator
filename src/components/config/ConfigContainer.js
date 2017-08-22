import { connect } from 'react-redux'
import { setConfig } from '../../actions'
import EditConfigButton from './EditConfigButton'

const mapStateToProps = state => {
    return {
        config: state.config
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setConfig: (config) => {
            dispatch(setConfig(config))
        },
    }
}

let ConfigContainer = connect(mapStateToProps, mapDispatchToProps)(EditConfigButton)

export default ConfigContainer