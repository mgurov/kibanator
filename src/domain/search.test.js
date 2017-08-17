import makeSearch from './search'
const _ = require('lodash');

test('should filter on the_service when asked so', () => {
    var serviceName = "the_service"
    let actual = makeSearch({serviceName, from: new Date()});
    
    const mustPath = 'query.filtered.filter.bool.must';
    expect(actual).toHaveProperty(mustPath);
    let must = _(actual).get(mustPath);

    var dataAppSearchFun = _.bind(_.get, _, _, ['query', 'match', 'Data.app']);
    var dataAppFilter = _(must).map(dataAppSearchFun).find();
    expect(dataAppFilter).toEqual(expect.objectContaining({
        "query": serviceName
    }));
});