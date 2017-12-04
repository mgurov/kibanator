import LogHit from './LogHit'

test('translate field values to strings', function () {
    let hitData = {_id: 1, _source:{
        "string": "str",
        "number": 2,
        "null": null,
    }}

    let actual = new LogHit(hitData, {timeField: "bl", messageField: "ah"})
    expect(actual.fields).toEqual(
        {
            "string": "str",
            "number": "2",
            "null": "null",
        }
    )
});