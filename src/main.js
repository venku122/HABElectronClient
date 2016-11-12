const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path');
const url = require('url');

let win;

const createWindow = () => {
  // create browser window
  win = new BrowserWindow({ width: 800, height: 600 });

  // load index.html
  console.log(`${__dirname}/../client/index.html`);
  win.loadURL(url.format({
    pathname: `${__dirname}/../client/index.html`,
    protocol: 'file:',
    slashes: true,
  }));

  // open the devTools
  win.webContents.openDevTools();

  win.on('closed', () => {
    // Dereference window object on close
    win = null;
  });
};

// Called when Electron is finished initializing
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // weird OSX shit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // weird OSX shit
  if (win === null) {
    createWindow();
  }
});
