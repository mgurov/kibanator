import {flattenMap} from './maps'
import _ from 'lodash'

function LogHit(h, config) {
    let r = {
        id : h._id,
        fields : flattenMap(h._source, v => {
            if (_.isString(v)) {
                return v
            } else {
                return JSON.stringify(v)
            }
        }),
    }
    r.timestamp = r.fields[config.timeField]
    r.message = r.fields[config.messageField]
    return r
}

export default LogHit