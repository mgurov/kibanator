function DocumentTitle({title}) {
    document.title = 'Kibanator' + (title? ' - ' + title : '')
    return null
}

export default DocumentTitle;