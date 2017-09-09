export function messageContainsCaptor(key, messageContains) {
    return {key, messageContains}
}

export function captorToPredicate(captor) {
    return (h) => h.message.indexOf(captor.messageContains) > -1
}