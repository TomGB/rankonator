(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const start = async () => {
    const { setReplay, setOriginalList } = require('./askUser')

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

        selectionArea.classList.add('hidden')
        questionBox.innerHTML = "";

        outputBox.innerHTML = `<h2>Ranked order</h2> ${sorted.join('<br>')}`
    })
}

window.onload = start

},{"./askUser":2,"./quickSort":3}],2:[function(require,module,exports){
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

let userActions = []

undoButton.addEventListener("click", async () => {
    undoListener.cb()
})

const updateDom = (item, pivot) => {
    undoButton.classList.add('disabled')
    if (userActions.length) undoButton.classList.remove('disabled')

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

    const progressBar = document.createElement("p")
    progressBar.appendChild(document.createTextNode(`Estimated progress: ${userActions.length} / ${average(originalList.length)}`));
    questionBox.appendChild(progressBar)

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

},{}],3:[function(require,module,exports){
const { askUser } = require('./askUser')

const quickSort = async input => {
    if (input.length <= 1) {
        return input;
    }
    const less = [], greater = [];

    const pivot = input.shift();

    for (let i = input.length - 1; i >= 0; i--) {
        const response = await askUser(input[i], pivot);

        if (response) {
            less.push(input[i]);
        } else {
            greater.push(input[i]);
        }
    }

    const leftResult = await quickSort(less)
    const rightResult = await quickSort(greater)

    return [].concat(leftResult, pivot, rightResult);
};

module.exports = quickSort

},{"./askUser":2}]},{},[1]);
