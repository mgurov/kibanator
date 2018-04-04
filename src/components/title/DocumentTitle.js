function DocumentTitle({title}) {
    if (title) {
        document.title = title
    } else {
        document.title = 'Kibanator'
    }
    return null
}

export default DocumentTitle;