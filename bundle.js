(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let originalList
let userActions = []

const clone = input => JSON.parse(JSON.stringify(input))

const start = async () => {
  const questionBox = document.getElementsByClassName('question')[0];

  const askUser = (item, pivot) => new Promise((resolve) => {
    questionBox.innerHTML = "<h2>Which of these should rank higher?<h2>"

    const answerOne = document.createElement("div")
    answerOne.classList.add('answer')
    answerOne.appendChild(document.createTextNode(item));
    questionBox.appendChild(answerOne)

    const answerTwo = document.createElement("div")
    answerTwo.classList.add('answer')
    answerTwo.appendChild(document.createTextNode(pivot));
    questionBox.appendChild(answerTwo)

    const a1ClickListener = () => {
      userActions.push(true)
      answerOne.remove()
      answerTwo.remove()
      resolve(true);
    }

    const a2ClickListener = () => {
      userActions.push(false)
      answerOne.remove()
      answerTwo.remove()
      resolve(false);
    }

    answerOne.addEventListener("click", a1ClickListener);
    answerTwo.addEventListener("click", a2ClickListener);
    document.addEventListener('keypress', ({ key }) => {
      if (key === '1') {
        a1ClickListener()
        return
      }
      if (key === '2') {
        a2ClickListener()
        return
      }
    })
  });

  const quickSort = async (input, replayActions) => {
    if (input.length <= 1) {
      return input;
    }
    const less = [], greater = [];

    const pivot = input.shift();

    let stopReplay = false

    for (let i = input.length - 1; i >= 0; i--) {
      let response

      if (replayActions && !replayActions.length) {
        response = await askUser(input[i], pivot);
        stopReplay = true
      } else if (replayActions && replayActions.length) {
        response = replayActions.shift();
      } else {
        response = await askUser(input[i], pivot);
      }

      if (response) {
        less.push(input[i]);
      } else {
        greater.push(input[i]);
      }
    }

    return [].concat(await quickSort(less, stopReplay && replayActions), pivot, await quickSort(greater, stopReplay && replayActions));
  };

  const goButton = document.getElementsByClassName('go')[0];
  const undoButton = document.getElementsByClassName('undo')[0];
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
    const sorted = await quickSort(clone(listWithoutBlanks))

    selectionArea.classList.add('hidden')
    questionBox.innerHTML = "";

    outputBox.innerHTML = `<h2>Ranked order</h2> ${sorted.join('<br>')}`
  })

  undoButton.addEventListener("click", async () => {
    userActions.pop()
    console.log(userActions)
    const sorted = await quickSort(clone(originalList), clone(userActions))

    selectionArea.classList.add('hidden')
    questionBox.innerHTML = "";

    outputBox.innerHTML = `<h2>Ranked order</h2> ${sorted.join('<br>')}`
  })
}

window.onload = start

},{}]},{},[1]);
