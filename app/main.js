const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });
});

console.log('Starting up!...');
