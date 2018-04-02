var makeSearch = function ({serviceName, from, to=new Date(), config}) {
    serviceName = serviceName || ''
    return {
        "query": {
            "constant_score": {
                "filter": {
                    "bool": {
                        "must": [
                            {term: {[config.serviceField]: serviceName.toLowerCase()}},
                            {term: {[config.levelField]: config.levelValue.toLowerCase()}},
                            {
                                "range": {
                                [config.timeField]: {
                                    "gte": from.getTime(),
                                    "lte": to.getTime(),
                                    "format": "epoch_millis"
                                }
                                }
                            }
                        ],
                        "must_not": []
                    }
                }
            }
        }
    }
}

export default makeSearch;