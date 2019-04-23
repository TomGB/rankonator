(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
            errorArea.innerHTML = 'Please input at least two items'

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

        undoButton.classList.add('hidden')
        questionBox.innerHTML = "";

        outputBox.innerHTML = `<h2>Ranked order</h2> ${sorted.join('<br>')}`
    })
}

window.onload = start

},{"./askUser":2,"./bookmarkButton":3,"./quickSort":4}],2:[function(require,module,exports){
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
const bookmarklet = require('../trello/bookmarklet.json')

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const bookmarkButton = () => {
    const bookmarkLink = document.getElementsByClassName('trello-bookmark')[0]
    bookmarkLink.setAttribute('href', bookmarklet)

    const copyButton = document.getElementsByClassName('trello-bookmark-copy')[0]
    const clipboardMessage = document.getElementsByClassName('clipboard-message')[0]

    copyButton.addEventListener('click', () => {
        copyToClipboard(bookmarklet)
        clipboardMessage.classList.remove('hidden')
    })
}

module.exports = bookmarkButton

},{"../trello/bookmarklet.json":5}],4:[function(require,module,exports){
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

},{"./askUser":2}],5:[function(require,module,exports){
module.exports="javascript:{(function(){function t(e,n,s){function a(m,o){if(!n[m]){if(!e[m]){var r=\"function\"==typeof require&&require;if(!o&&r)return r(m,!0);if(l)return l(m,!0);var i=new Error(\"Cannot find module '\"+m+\"'\");throw i.code=\"MODULE_NOT_FOUND\",i}var u=n[m]={exports:{}};e[m][0].call(u.exports,function(t){var n=e[m][1][t];return a(n||t)},u,u.exports,t,e,n,s)}return n[m].exports}for(var l=\"function\"==typeof require&&require,m=0;m<s.length;m++)a(s[m]);return a}return t})()({1:[function(t,e,n){let s=()=>{let t=Array.from(document.getElementsByClassName('js-list-content')),e=t.map(t=>({name:t.getElementsByClassName('list-header-name')[0].value,items:Array.from(t.getElementsByClassName('list-card-title')).map(({innerText:t})=>t)})),n='https://tomgb.github.io/user-sort/';window.open(n+'?data='+encodeURIComponent(JSON.stringify(e)))};s()},{}]},{},[1])\n};void(0);"
},{}]},{},[1]);
