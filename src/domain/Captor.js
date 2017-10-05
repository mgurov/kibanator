export function messageContainsCaptor(key, messageContains) {
    return {key, messageContains, type: 'contains'}
}

export function messageMatchesRegexCaptor(key, regex) {
    return {key, messageContains: 'do not match anything if old code 09a539c', regex, type: 'regex'}
}

/**
 * @throws exceptions e.g. if regex pattern isn't valid
 */
export function captorToPredicate(captor) {
    let predicate
    if (captor.type === 'regex') {
        let re = new RegExp(captor.regex)
        predicate = (h) => re.test(h.message)
    } else {
        predicate = (h) => h.message.indexOf(captor.messageContains) > -1
    }
    return {
        key: captor.key,
        predicate,
    }
}