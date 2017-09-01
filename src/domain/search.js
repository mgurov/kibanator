var makeSearch = function ({serviceName, from, to=new Date(), config}) {
    serviceName = serviceName || ''
    return {
        "query": {
            "filtered": {
                "query": {
                    "query_string": {
                        "analyze_wildcard": true,
                        "query": "*"
                    }
                },
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "query": {
                                    "match": {
                                        [config.serviceField]: {
                                            "query": serviceName,
                                            "type": "phrase"
                                        }
                                    }
                                }
                            },
                            {
                                "query": {
                                    "match": {
                                        [config.levelField || "@fields.level"]: {
                                            "query": "ERROR",
                                            "type": "phrase"
                                        }
                                    }
                                }
                            },
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
        },
        //"size": 500,
        "sort": [
          {
            [config.timeField]: {
              "order": "asc",
              "unmapped_type": "boolean"
            }
          }
        ],
        "fields": [
          "*",
          "_source"
        ],
        "fielddata_fields": [
            config.timeField
        ]
    }
}

export default makeSearch;