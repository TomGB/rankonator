const undoButton = document.getElementsByClassName('undo')[0];
const questionBox = document.getElementsByClassName('question')[0];
const progressBarArea = document.getElementsByClassName('progress-bar')[0];
const progressBar = document.getElementsByClassName('bar')[0];

const outputBox = document.getElementsByClassName('output')[0];
const selectionArea = document.getElementsByClassName('selection-area')[0];

const average = n => Math.floor(n * Math.log(n))
const clone = input => JSON.parse(JSON.stringify(input))

const keyListeners = {
    cb1: () => { },
    cb2: () => { }
}

const undoListener = {
    cb: () => { }
}

const setupKeyListener = (cb1, cb2) => {
    keyListeners.cb1 = cb1
    keyListeners.cb2 = cb2
}

document.addEventListener('keypress', ({ key }) => {
    if (key === '1') {
        keyListeners.cb1()
        return
    }
    if (key === '2') {
        keyListeners.cb2()
        return
    }
})

let userActions = []

undoButton.addEventListener("click", async () => {
    undoListener.cb()
})

const updateDom = (item, pivot) => {
    undoButton.classList.add('hidden')
    if (userActions.length) undoButton.classList.remove('hidden')

    questionBox.innerHTML = "<h2>Which of these should rank higher?<h2>"

    const answerOne = document.createElement("div")
    answerOne.classList.add('answer')
    answerOne.appendChild(document.createTextNode(item));
    questionBox.appendChild(answerOne)

    const answerTwo = document.createElement("div")
    answerTwo.classList.add('answer')
    answerTwo.appendChild(document.createTextNode(pivot));
    questionBox.appendChild(answerTwo)

    return { answerOne, answerTwo }
}

let replayActions = []

const setReplay = () => {
    replayActions = clone(userActions)
    replayActions.pop()
    userActions = []
}

let originalList = []

const setOriginalList = input => {
    originalList = input
}

const askUser = (item, pivot) => new Promise((resolve, reject) => {
    if (replayActions.length) {
        const nextAction = replayActions.shift()
        console.log('ra', replayActions)
        userActions.push(nextAction)
        console.log('history', userActions)
        resolve(nextAction)
    }

    const { answerOne, answerTwo } = updateDom(item, pivot)

    progressBarArea.classList.remove('hidden')

    const rawPercent = userActions.length / average(originalList.length) * 100

    const percent = rawPercent <= 100 ? rawPercent : 100

    progressBar.style.width = percent + '%'

    const a1ClickListener = () => {
        userActions.push(true)
        answerOne.remove()
        answerTwo.remove()
        console.log('history', userActions)
        resolve(true);
    }

    const a2ClickListener = () => {
        userActions.push(false)
        answerOne.remove()
        answerTwo.remove()
        console.log('history', userActions)
        resolve(false);
    }

    answerOne.addEventListener('click', a1ClickListener);
    answerTwo.addEventListener('click', a2ClickListener);
    setupKeyListener(a1ClickListener, a2ClickListener)

    undoListener.cb = async () => {
        reject('undo')
    }
});

module.exports = { askUser, setReplay, setOriginalList }
