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

function mapFlattener(input, accumulator, prefix, valueTransformer) {
    return _.transform(input, (result, value, key) => {
        if (_.isPlainObject(value)) {
            return mapFlattener(value, accumulator, prefix + key + ".", valueTransformer)
        } else {
            accumulator[prefix + key] = valueTransformer(value)
        }
    }, accumulator)
}

function flattenMap(input, valueTransformer = _.identity) {
    return mapFlattener(input, {}, "", valueTransformer)
}

export { flattenKeys, flattenMap }