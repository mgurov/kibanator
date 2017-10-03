
export function handleEnterKey(handler) {
    return (e) => {
        if ((e.keyCode === 13) && (e.target.type !== "textarea")) {
            handler(e)
        }
    }
}

export function copyText(text) {
    return () => {
        var textField = document.createElement('textarea')
        textField.innerText = text
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    }
}