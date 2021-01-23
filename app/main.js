const { app, BrowserWindow, dialog } = require('electron');

const fse = require('fs-extra');
const path = require('path');

let mainWindow = null;

app.on('ready', () => {
  const windowOptions = {
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  };
  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('ready-to-show', () => mainWindow.show());
});

module.exports.getFile = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    title: 'Open Custom Dialog',
    filters: [
      { name: 'Markdown', extensions: ['md', 'mdown', 'markdown'] },
      { name: 'Text files', extensions: ['txt'] },
    ],
  });

  if (result && result.canceled) return;
  openFile(result);
};

const openFile = async (dialogResult) => {
  const [fileName] = dialogResult.filePaths;
  mainWindow.webContents.send('file-open-started');
  const contents = await fse.readFile(fileName, { encoding: 'utf8' });
  mainWindow.webContents.send('file-opened', fileName, contents);
};
console.log('Starting up!...');
