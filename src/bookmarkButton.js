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
