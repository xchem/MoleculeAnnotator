const { app, BrowserWindow, crashReporter} = require("electron");

console.log(app.getPath('crashDumps'))
crashReporter.start({ submitURL: '', uploadToServer: false })

const path = require("path");
const express = require('express');
const process = require('process');
const fs = require("fs");

const { hideBin } = require('yargs/helpers');
const isDev = require("electron-is-dev");

const { ipcMain } = require('electron');
const yargs = require('yargs');
const { format, writeToPath } = require('@fast-csv/format');
const { parse } = require('fast-csv');
const { pipeline } = require('node:stream/promises');
const {Sequelize, DataTypes} = require("sequelize")


// const { something } = require('./notafile');
const { handlerMap } = require('./handlers')
const { loadData, getDB, getOutputData } = require('./initialization')


// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

console.log('creating window');
console.log(handlerMap);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, "..", "src", "icons", "png", "128x128.png"),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      webSecurity: false,

    }

  });
  console.log(path.join(__dirname, 'preload.js'));

  let server;

  if (!isDev) {

    const MINPORT = 32778;
    const MAXPORT = 32800;

    const exp = express();

    exp.use(function (req, res, next) {
      res.header("Cross-Origin-Embedder-Policy", "require-corp");
      res.header("Cross-Origin-Opener-Policy", "same-origin");
      next();
    });

    exp.use(express.static(path.join(__dirname, "..", "build")));

    exp.get('/', (req, res) => {
      res.send('Hello World! ' + path.join(__dirname, "..", "build"));
    });

    function serve(port) {
      server = exp.listen(port, () => {
        console.log('Listening on port:', server.address().port);
        win.loadURL("http://localhost:" + server.address().port + "/index.html");
      }).on('error', function (err) {
        if (port < MAXPORT) {
          serve(port + 1);
        } else {
          throw new Error("Run out of ports in Moorhen's range 32778-32800");
        }
      });
    }
    serve(MINPORT);
  } else {
    win.loadURL("http://localhost:9999");
  }

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(
  async () => {
    // Parse the command line used to launch the program for a file path
    const argv = yargs(hideBin(process.argv)).parse();
    console.log('Arguments:');
    console.log(argv);

    // Define and look for input and output csv files 
    const inputPath = argv.in;
    const outputPath = argv.out;

    console.log('Arguments:');
    console.log(inputPath);
    console.log(outputPath);

    let inputData = loadData(inputPath);
    let db = getDB(outputPath);
    let outputData = getOutputData(db);


    console.log('Data:');    
    console.log(inputData);
    console.log(outputData);
    
    return {
      args: argv,
      inputData: inputData,
      outputData: outputData,
      db:db
    }
  }

  // Once the input data is parsed, register the handlers for controlling the backend from the frontend
  // 
).then((obj) => {
  const inputData = obj.inputData;
  let outputData = obj.outputData;
  const args = obj.args;
  let db = obj.db;

  let state = {
    args: args,
    inputData: inputData,
    outputData: outputData,
    db: db
  };

  console.log('Registering handlers...');
  for (const [key, handler] of Object.entries(handlerMap)) {
    ipcMain.handle(key, async (event, action) => {return await handler(event, action, state)})
  }
  // handlerMap['test-write-database'](null, null, state);

  console.log('creating window');

  createWindow()
  console.log('created window');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

