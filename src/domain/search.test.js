import makeSearch from './search'
const _ = require('lodash');

test('should filter on the_service when asked so', () => {
    var serviceName = "the_service"
    let actual = makeSearch({serviceName, from: new Date(), config:{serviceField:'Data.app'}});
    
    const mustPath = 'query.constant_score.filter.bool.must';
    expect(actual).toHaveProperty(mustPath);
    let must = _(actual).get(mustPath);

    var dataAppSearchFun = _.bind(_.get, _, _, ['term', 'Data.app']);
    var dataAppFilter = _(must).map(dataAppSearchFun).find();
    expect(dataAppFilter).toEqual(serviceName);
});