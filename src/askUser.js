const undoButton = document.getElementsByClassName('undo')[0];
const questionBox = document.getElementsByClassName('question')[0];

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

const userActions = []

undoButton.addEventListener("click", async () => {
    undoListener.cb()
})

const updateDom = () => {
    undoButton.classList.add('hidden')
    if (userActions.length) undoButton.classList.remove('hidden')
}

const askUser = (item, pivot) => new Promise((resolve, reject) => {
    updateDom()
    questionBox.innerHTML = "<h2>Which of these should rank higher?<h2>"

    const answerOne = document.createElement("div")
    answerOne.classList.add('answer')
    answerOne.appendChild(document.createTextNode(item));
    questionBox.appendChild(answerOne)

    const answerTwo = document.createElement("div")
    answerTwo.classList.add('answer')
    answerTwo.appendChild(document.createTextNode(pivot));
    questionBox.appendChild(answerTwo)

    // const progressBar = document.createElement("p")
    // progressBar.appendChild(document.createTextNode(`Estimated progress: ${userActions.length} / ${average(originalList.length)}`));
    // questionBox.appendChild(progressBar)

    const a1ClickListener = () => {
        userActions.push(true)
        console.log(userActions)
        answerOne.remove()
        answerTwo.remove()
        resolve(true);
    }

    const a2ClickListener = () => {
        userActions.push(false)
        console.log(userActions)
        answerOne.remove()
        answerTwo.remove()
        resolve(false);
    }

    answerOne.addEventListener('click', a1ClickListener);
    answerTwo.addEventListener('click', a2ClickListener);
    setupKeyListener(a1ClickListener, a2ClickListener)

    undoListener.cb = async () => {
        reject('undo')
    }
});

module.exports = askUser
