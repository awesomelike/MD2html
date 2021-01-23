/* eslint-disable no-alert */
const marked = require('marked');
const { remote, ipcRenderer, shell } = require('electron');
const path = require('path');

const mainProcess = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const state = {
  title: 'MD2Html',
  filePath: null,
  originalContents: '',
};

const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
  updateWindowTitle(currentContent !== state.originalContents);
});

saveMarkdownButton.addEventListener('click', () => {
  mainProcess.saveMarkdown(state.filePath, markdownView.value);
});

saveHtmlButton.addEventListener('click', () => {
  mainProcess.saveHtml(htmlView.innerHTML);
});

showFileButton.addEventListener('click', () => {
  if (!state.filePath) {
    return alert('No file');
  }
  return shell.showItemInFolder(state.filePath);
});

openInDefaultButton.addEventListener('click', () => {
  if (!state.filePath) {
    return alert('No file');
  }
  return shell.openExternal(state.filePath);
});

openFileButton.addEventListener('click', () => {
  mainProcess.getFile();
});

const updateWindowTitle = (isEdited) => {
  let title = 'MD2html';
  if (state.filePath) {
    title = `${path.basename(state.filePath)} - ${title}`;
  }

  if (isEdited) {
    title = `${title} (Edited)`;
  }

  showFileButton.disabled = !state.filePath;
  openInDefaultButton.disabled = !state.filePath;

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;

  currentWindow.setTitle(title);
};

ipcRenderer.on('file-open-started', () => {
  markdownView.value = 'Loading...';
});

ipcRenderer.on('file-opened', (_, fileName, contents) => {
  state.filePath = fileName;
  state.originalContents = contents;

  markdownView.value = contents;

  renderMarkdownToHtml(contents);
  updateWindowTitle();
});
