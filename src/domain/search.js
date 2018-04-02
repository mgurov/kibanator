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
        filters.push({term: {[config.serviceField]: serviceName.toLowerCase()}})
    }
    if (config.levelField && config.levelValue) {
        filters.push({term: {[config.levelField]: config.levelValue.toLowerCase()}})
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