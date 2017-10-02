
export function handleEnterKey(handler) {
    return (e) => {
        if ((e.keyCode === 13) && (e.target.type !== "textarea")) {
            handler(e)
        }
    }
}
