import {flattenMap} from './maps'

function LogHit(h, config) {
    let r = {
        id : h._id,
        fields : flattenMap(h._source),
    }
    r.timestamp = r.fields[config.timeField]
    r.message = r.fields[config.messageField]
    r.favourite = false
    return r
}

export default LogHit