const start = () => {
    const listElements = Array.from(document.getElementsByClassName('js-list-content'))
    const lists = listElements.map(list => ({
        name: list.getElementsByClassName('list-header-name')[0].value,
        items: Array.from(list.getElementsByClassName('list-card-title')).map(({ innerText }) => innerText)
    }))

    const baseUrl = 'https://tomgb.github.io/user-sort/'

    window.open(baseUrl + '?data=' + encodeURI(JSON.stringify(lists)))
}

start()
