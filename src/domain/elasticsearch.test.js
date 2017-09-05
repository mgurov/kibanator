import {selectIndexInterval} from './elasticsearch'
const _ = require('lodash');

test('today only', function () {
    let actual = selectIndexInterval('blah-', 
        new Date('Thu Jul 20 2017 11:16:48 GMT+0200 (CEST)'), 
        new Date('Thu Jul 20 2017 13:16:48 GMT+0200 (CEST)'));
    expect(actual).toEqual(['blah-2017.07.20']);
});
test('today and yesterday should return both', function () {
    let actual = selectIndexInterval('blah-', 
        new Date('Thu Jul 19 2017 11:16:48 GMT+0200 (CEST)'), 
        new Date('Thu Jul 20 2017 13:16:48 GMT+0200 (CEST)'));
    expect(actual).toEqual(['blah-2017.07.19', 'blah-2017.07.20']);
});
test('today and yesterday should return both even if beginning closer than 24h to the end', function () {
    let actual = selectIndexInterval('blah-', 
    new Date('Thu Jul 19 2017 13:17:48 GMT+0200 (CEST)'), 
    new Date('Thu Jul 20 2017 13:16:48 GMT+0200 (CEST)'));
    expect(actual).toEqual(['blah-2017.07.19', 'blah-2017.07.20']);
});
test('three days should return all three', function () {
    let actual = selectIndexInterval('blah-', 
    new Date('Thu Jul 18 2017 00:00:48 GMT+0200 (CEST)'), 
    new Date('Thu Jul 20 2017 13:16:48 GMT+0200 (CEST)'));
    expect(actual).toEqual(['blah-2017.07.18', 'blah-2017.07.19', 'blah-2017.07.20']);
});