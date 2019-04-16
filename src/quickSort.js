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
