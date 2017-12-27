import * as c from './Captor'

test("should ignore missing fields when contains", () => {

    let captor = c.messageContainsCaptor('key', 'text', 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.apply({ fields: {} })
    ).toBeNull()
})

test("should stringify numeric fields when contains", () => {

    let captor = c.messageContainsCaptor('key', '12', 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.apply({ fields: {'field':123} })
    ).not.toBeNull()

    expect(
        predicate.apply({ fields: {'field':321} })
    ).toBeNull()
})

test("should stringify numeric fields when regex", () => {

    let captor = c.messageMatchesRegexCaptor('key', '12', 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.apply({ fields: {'field':123} })
    ).not.toBeNull()

    expect(
        predicate.apply({ fields: {'field':321} })
    ).toBeNull()
})

test("should ignore missing fields when regex", () => {

    let captor = c.messageMatchesRegexCaptor('key', 'text', 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.apply({ fields: {} })
    ).toBeNull()
})

test("use first match group when transforming regex has one", () => {

    let captor = c.messageExtractor(c.messageMatchesRegexCaptor('key', 'b(\\d+)d', 'field'), 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.apply({ fields: {'field': 'ab23de'} })
    ).toEqual({matched: true, message: "23"})
})

test("use matched part of the field when regex has no group", () => {

    let captor = c.messageExtractor(c.messageMatchesRegexCaptor('key', 'b\\d+d', 'field'), 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.apply({ fields: {'field': 'ab23de'} })
    ).toEqual({matched: true, message: "b23d"})
})

test("take the field provided for simple contains", () => {

    let captor = c.messageExtractor(c.messageContainsCaptor('key', 'abcd', 'field'), 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.apply({ fields: {'field': '01abcdefj'} })
    ).toEqual({matched: true, message: "01abcdefj"})
})

