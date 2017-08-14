import _ from "lodash"

function mapKeyPath(input, prefix = "") {
    return _.map(input, (value, key) => {
        if (_(value).isPlainObject()) {
            return mapKeyPath(value, prefix + key + ".")
        } else {
            return prefix + key
        }
    })
}
function flattenKeys(input) {
    return _.flattenDeep(mapKeyPath(input))
}

function mapFlattener(input, accumulator, prefix) {
    return _.transform(input, (result, value, key) => {
        if (_.isPlainObject(value)) {
            return mapFlattener(value, accumulator, prefix + key + ".")
        } else {
            accumulator[prefix + key] = value
        }
    }, accumulator)
}

function flattenMap(input) {
    return mapFlattener(input, {}, "")
}

export { flattenKeys, flattenMap }