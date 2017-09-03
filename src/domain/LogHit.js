import {flattenMap} from './maps'

// class represents a hit returned by the elastic search for a single row record
class LogHit {
    constructor(h, config) {
        this.id = h._id
        this.fields = flattenMap(h._source)
        this.timestamp = this.fields[config.timeField]
        this.message = this.fields[config.messageField];
    }

    getId() {
        return this.id
    }

    getTimestamp() {
        return this.timestamp
    }

    getMessage() {
        return this.message
    }

    getFields() {
        return this.fields
    }
}

export default LogHit