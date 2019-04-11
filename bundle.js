(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const start = async () => {
  const questionBox = document.getElementsByClassName('question')[0];

  const askUser = (item, pivot) => new Promise((resolve) => {
    questionBox.innerHTML = "Which one is more important?"

    const answerOne = document.createElement("div")
    answerOne.classList.add('answer')
    answerOne.appendChild(document.createTextNode(item));
    questionBox.appendChild(answerOne)

    const answerTwo = document.createElement("div")
    answerTwo.classList.add('answer')
    answerTwo.appendChild(document.createTextNode(pivot));
    questionBox.appendChild(answerTwo)

    const a1ClickListener = () => {
      answerOne.remove()
      answerTwo.remove()
      resolve(true);
    }

    const a2ClickListener = () => {
      answerOne.remove()
      answerTwo.remove()
      resolve(false);
    }

    answerOne.addEventListener("click", a1ClickListener);
    answerTwo.addEventListener("click", a2ClickListener);
  });


  const quickSort = async (input) => {
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

    return [].concat(await quickSort(less), pivot, await quickSort(greater));
  };

  const goButton = document.getElementsByClassName('go')[0];
  const listInput = document.getElementsByClassName('input')[0];
  const outputBox = document.getElementsByClassName('output')[0];

  goButton.addEventListener("click", async () => {
    const list = listInput.value.trim().split('\n')
    const listWithoutBlanks = list.filter((item) => item !== '')
    const sorted = await quickSort(listWithoutBlanks);

    questionBox.innerHTML = "";

    outputBox.innerHTML = sorted.join('<br>')
  })
}

window.onload = start

},{}]},{},[1]);
