import {flattenKeys, flattenMap} from './maps'

test('should flatten map keys', () => {
    let given = {
        "a" : 1,
        "b" : [2,3],
        "c" : {
            "d" : 4,
            "e" : 5,
            "f" : {"j" : "h"}
        }
    }
    expect(flattenKeys(given)).toEqual(
        ["a", "b", "c.d", "c.e", "c.f.j"]
    )
});

test('should flatten maps', () => {
    let given = {
        "a" : 1,
        "b" : [2,3],
        "c" : {
            "d" : 4,
            "e" : 5,
            "f" : {"j" : "h"}
        }
    }
    expect(flattenMap(given)).toEqual(
        {"a" : 1, "b" : [2,3], "c.d" : 4, "c.e" : 5, "c.f.j" : "h"}
    )
});