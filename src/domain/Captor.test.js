import * as c from './Captor'

test("should ignore missing fields when contains", () => {

    let captor = c.messageContainsCaptor('key', 'text', 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.predicate({ fields: {} })
    ).toEqual(false)
})

test("should stringify numeric fields when contains", () => {

    let captor = c.messageContainsCaptor('key', '12', 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.predicate({ fields: {'field':123} })
    ).toEqual(true)

    expect(
        predicate.predicate({ fields: {'field':321} })
    ).toEqual(false)
})

test("should stringify numeric fields when regex", () => {

    let captor = c.messageMatchesRegexCaptor('key', '12', 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.predicate({ fields: {'field':123} })
    ).toEqual(true)

    expect(
        predicate.predicate({ fields: {'field':321} })
    ).toEqual(false)
})

test("should ignore missing fields when regex", () => {

    let captor = c.messageMatchesRegexCaptor('key', 'text', 'field')
    let predicate = c.captorToPredicate(captor)

    expect(
        predicate.predicate({ fields: {} })
    ).toEqual(false)
})