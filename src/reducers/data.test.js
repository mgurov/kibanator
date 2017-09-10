import {mergeHits} from './data'
import _ from 'lodash'
import {messageContainsCaptor, captorToPredicate} from '../domain/Captor'

describe('some hits present, new received', () => {
    let given = {
        hits: [
            {_id : "1"},
            {_id : "2"},
        ],
        knownIds : {"1": 1, "2": 1},
        propertyWeDontCareAbout: 'valueWeDontCareAbout',
    }

    let originalGiven = _.cloneDeep(given)

    let arrivedHits = [
        {_id : "2"},
        {_id : "3"},
    ]

    test('new ones should be taken in', () => {
        expect(mergeHits(arrivedHits, given)).toEqual(
            {
                hits: [
                    {_id : "1"},
                    {_id : "2"},
                    {_id : "3"},
                ],
                knownIds : {"1": 1, "2": 1, "3": 1},
                captures: {}
            }
        )
    })

    test('should not modify the original input', () => {
        expect(given).toEqual(originalGiven)
    })
    
});

describe('some hits present, nothing new received', () => {
    let given = {
        hits: [
            {_id : "1"},
            {_id : "2"},
        ],
        knownIds : {"1": 1, "2": 1}
    }

    let arrivedHits = [
        {_id : "2"},
        {_id : "1"},
    ]

    test('should remain the same', () => {
        let merged = mergeHits(arrivedHits, given)
        expect(merged).toBe(null)    
    })    
});

describe('duplicates received', () => {
    let given = {
        hits: [],
        knownIds : {}
    }

    let arrivedHits = [
        {_id : "2"},
        {_id : "2"},
    ]

    test('only once is taken', () => {
        expect(mergeHits(arrivedHits, given)).toEqual(
            {
                hits: [
                    {_id : "2"},
                ],
                knownIds : {"2": 1},
                captures: {}
            }
        )    
    })
});

describe('client side filtering', () => {
    let given = {
        hits: [],
        knownIds : {}
    }

    let arrivedHits = [
        {_id : "1", message : "catch me"},
        {_id : "2", message : "leave me"},
    ]

    let captorPredicates = [messageContainsCaptor("catch", "catch")].map(captorToPredicate)

    test('one taken another caught', () => {
        expect(mergeHits(arrivedHits, given, {captorPredicates})).toEqual(
            {
                hits: [
                    arrivedHits[1],
                ],
                knownIds : {"1": 1, "2": 1},
                captures: {
                    "catch" : [arrivedHits[0]]
                }
            }
        )    
    })
});