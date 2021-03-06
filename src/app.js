const start = async () => {
    const { setReplay, setOriginalList } = require('./askUser')

    const quickSort = require('./quickSort')
    require('./bookmarkButton')()

    const urlParams = new URLSearchParams(window.location.search)
    const jsonData = urlParams.get('data')
    console.log(jsonData)
    const urlData = JSON.parse(jsonData)
    console.log(urlData)

    const integrationArea = document.getElementsByClassName('integration-area')[0]
    const listInput = document.getElementsByClassName('options-input')[0];
    const undoButton = document.getElementsByClassName('undo')[0];

    if (urlData && urlData.length > 0) {
        const subTitle = document.createElement('h3')
        subTitle.appendChild(document.createTextNode('Select your list'))
        integrationArea.appendChild(subTitle)

        urlData.forEach(({ name, items }) => {
            const listSelectionButton = document.createElement('a')
            listSelectionButton.classList.add('button')
            listSelectionButton.appendChild(document.createTextNode(name))
            integrationArea.appendChild(listSelectionButton)

            listSelectionButton.addEventListener('mouseover', () => {
                listInput.setAttribute('placeholder', items.join('\n'))
            })

            listSelectionButton.addEventListener('mouseout', () => {
                listInput.setAttribute('placeholder', '')
            })

            listSelectionButton.addEventListener('click', () => {
                listInput.value = items.join('\n')
            })
         })
    }

    let originalList

    const clone = input => JSON.parse(JSON.stringify(input))

    const questionBox = document.getElementsByClassName('question')[0];

    const goButton = document.getElementsByClassName('go')[0];
    const inputArea = document.getElementsByClassName('input-area')[0];
    const outputBox = document.getElementsByClassName('output')[0];

    goButton.addEventListener("click", async e => {
        e.preventDefault()
        const list = listInput.value.trim().split('\n')
        const listWithoutBlanks = list.filter((item) => item !== '')

        if (listWithoutBlanks.length < 2) {
            const errorArea = document.getElementsByClassName('list-input-error')[0];
            errorArea.classList.remove('hidden')
            errorArea.innerHTML = 'Enter two or more items, with one item per line'

            return
        }

        inputArea.classList.add('hidden')

        originalList = listWithoutBlanks
        setOriginalList(originalList)

        let finished = false
        let sorted

        do {
            try {
                sorted = await quickSort(clone(listWithoutBlanks))

                finished = true
            } catch (e) {
                console.log(e)
                setReplay()
            }
        } while(!finished)

        const progressBarArea = document.getElementsByClassName('progress-bar')[0];
        progressBarArea.classList.add('hidden')

        undoButton.classList.add('hidden')
        questionBox.innerHTML = "";

        outputBox.innerHTML = `<h2>Ranked order</h2> ${sorted.join('<br>')}`
    })
}

window.onload = start
