var makeSearch = function ({serviceName, from, to=new Date(), config}) {


    let filters = [
        {
            "range": {
            [config.timeField]: {
                "gte": from.getTime(),
                "lte": to.getTime(),
                "format": "epoch_millis"
            }
            }
        }
    ]

    if (config.serviceField && serviceName) {
        filters.push({terms: {[config.serviceField]: serviceName.toLowerCase().split(',')}})
    }
    if (config.levelField && config.levelValue) {
        filters.push({terms: {[config.levelField]: config.levelValue.toLowerCase().split(',')}})
    }

    serviceName = serviceName || ''
    return {
        "query": {
            "constant_score": {
                "filter": {
                    "bool": {
                        "must": filters,
                        "must_not": []
                    }
                }
            }
        }
    }
}

export default makeSearch;