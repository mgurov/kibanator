var makeSearch = function (serviceName) {
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
                        "gte": 1502619599395,
                        "lte": 1502620499395,
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
              "order": "desc",
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