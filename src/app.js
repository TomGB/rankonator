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
  const listInput = document.getElementsByClassName('options-input')[0];
  const outputBox = document.getElementsByClassName('output')[0];
  const inputArea = document.getElementsByClassName('input-area')[0];

  goButton.addEventListener("click", async () => {
    inputArea.classList.add('hidden')
    const list = listInput.value.trim().split('\n')
    const listWithoutBlanks = list.filter((item) => item !== '')
    const sorted = await quickSort(listWithoutBlanks);

    questionBox.innerHTML = "";

    outputBox.innerHTML = sorted.join('<br>')
  })
}

window.onload = start
