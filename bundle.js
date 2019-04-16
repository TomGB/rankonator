(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const start = async () => {
    const quickSort = require('./quickSort')

    const urlParams = new URLSearchParams(window.location.search)
    const urlData = JSON.parse(urlParams.get('data'))

    const integrationArea = document.getElementsByClassName('integration-area')[0]
    const listInput = document.getElementsByClassName('options-input')[0];

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

},{"./quickSort":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
const askUser = require('./askUser')

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
