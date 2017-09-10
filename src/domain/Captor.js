export function messageContainsCaptor(key, messageContains) {
    return {key, messageContains}
}

export function captorToPredicate(captor) {
    return {
        key: captor.key,
        predicate: (h) => h.message.indexOf(captor.messageContains) > -1,
    }
}