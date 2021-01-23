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

const openFile = async (fileName) => {
  mainWindow.webContents.send('file-open-started');
  const contents = await fse.readFile(fileName, { encoding: 'utf8' });
  app.addRecentDocument(fileName);
  mainWindow.webContents.send('file-opened', fileName, contents);
};

module.exports = {
  getFile: async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      title: 'Open Custom Dialog',
      filters: [
        { name: 'Markdown', extensions: ['md', 'mdown', 'markdown'] },
        { name: 'Text files', extensions: ['txt'] },
      ],
    });

    if (result && result.canceled) return;
    const [fileName] = result.filePaths;
    openFile(fileName);
  },
  saveMarkdown: async (filePath, contents) => {
    try {
      if (!filePath) {
        const fp = await dialog.showSaveDialog({
          title: 'Save Markdown',
          defaultPath: app.getPath('desktop'),
          filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
        });
        // eslint-disable-next-line no-param-reassign
        filePath = fp.filePath;
      }
      if (!filePath) return;
      await fse.writeFile(filePath, contents);
      openFile(filePath);
    } catch (error) {
      await dialog.showMessageBox('Error:', error.message);
    }
  },
  saveHtml: async (contents) => {
    try {
      const fp = await dialog.showSaveDialog({
        title: 'Save HTML',
        defaultPath: app.getPath('desktop'),
        filters: [{ name: 'HTML', extensions: ['html'] }],
      });
      if (!fp.filePath) return;
      await fse.writeFile(fp.filePath, contents);
    } catch (error) {
      await dialog.showMessageBox('Error:', error.message);
    }
  },
};

console.log('Starting up!...');
