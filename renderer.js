const { shell, remote } = require('electron');
const systemPreferences = remote.systemPreferences;

console.log(systemPreferences);
const newLinkUrl = document.querySelector('#new-link-url');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkSubmit = document.querySelector('.new-link-form--submit');
const linkTemplate = document.querySelector('#link-template');
const linksSection = document.querySelector('.links');

linksSection.addEventListener('click', (event) => {
    if (event.target.href) {
        event.preventDefault();
        shell.openExternal(event.target.href);
    }
})

newLinkUrl.addEventListener('keyup', () => {
    newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

const parser = new DOMParser();
const parseResponse = (text) => parser.parseFromString(text, 'text/html');
const findTitle = (nodes) => nodes.querySelector('title').textContent;

const addToPage = ({ title, url }) => {
    const newLink = linkTemplate.content.cloneNode(true);
    const titleElement = newLink.querySelector('.link--title');
    const urlElement = newLink.querySelector('.link--url');

    titleElement.textContent = title;
    urlElement.href = url;
    urlElement.textContent = url;

    linksSection.appendChild(newLink);

    return { title, url };
};

newLinkForm.addEventListener('submit', () => {
    event.preventDefault();

    const url = newLinkUrl.value;

    fetch(url)
        .then(response => response.text())
        .then(parseResponse)
        .then(findTitle)
        .then(title => ({ title, url }))
        .then(addToPage)
        .catch(err => console.error(err));

});

window.addEventListener('load', () => {
    if(systemPreferences.isDarkMode) {
        document.querySelector('link').href = 'styles-dark.css';
    }
})

// not in vpn option checked
// if not in vpn. place stored username and pw in form and submit form
// take response which should be the tol? then do stuff to tol and submit
// else (vpn is checked)
// goes to tol.bah.com
// does stuff to form