var makeSearch = function ({serviceName, from, to=new Date()}) {
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
                                        "Data.app": {
                                            "query": serviceName,
                                            "type": "phrase"
                                        }
                                    }
                                }
                            },
                  {
                    "range": {
                      "Timestamp": {
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
        "size": 500,
        "sort": [
          {
            "Timestamp": {
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
          "Timestamp"
        ]
    }
}

export default makeSearch;