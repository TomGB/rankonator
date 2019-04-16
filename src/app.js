const start = async () => {
    const quickSort = require('./quickSort')

    let originalList

    const clone = input => JSON.parse(JSON.stringify(input))

    const questionBox = document.getElementsByClassName('question')[0];

    const goButton = document.getElementsByClassName('go')[0];
    const listInput = document.getElementsByClassName('options-input')[0];
    const outputBox = document.getElementsByClassName('output')[0];
    const inputArea = document.getElementsByClassName('input-area')[0];
    const selectionArea = document.getElementsByClassName('selection-area')[0];

    goButton.addEventListener("click", async () => {
        inputArea.classList.add('hidden')
        selectionArea.classList.remove('hidden')
        const list = listInput.value.trim().split('\n')
        const listWithoutBlanks = list.filter((item) => item !== '')
        originalList = listWithoutBlanks

        let finished = false
        let sorted

        do {
            try {
                sorted = await quickSort(clone(listWithoutBlanks))

                finished = true
            } catch (e) {
                console.log(e)
            }
        } while(!finished)

        selectionArea.classList.add('hidden')
        questionBox.innerHTML = "";

        outputBox.innerHTML = `<h2>Ranked order</h2> ${sorted.join('<br>')}`
    })
}

window.onload = start
