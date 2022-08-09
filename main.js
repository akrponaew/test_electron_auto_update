const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

let mainWindow;

setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify();
}, 5000);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.webContents.openDevTools();
  mainWindow.maximize();
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();

  // const dialogOpts = {
  //   type: "info",
  //   buttons: ["OK"],
  //   title: "Application Info",
  //   message: app.getVersion(),
  // };

  // dialog.showMessageBox(dialogOpts).then((returnValue) => {
  //   // if (returnValue.response === 0) autoUpdater.quitAndInstall();
  //   // autoUpdater.quitAndInstall();
  //   // setImmediate(() => {
  //   //   app.removeAllListeners("window-all-closed");
  //   //   if (mainWindow != null) {
  //   //     mainWindow.close();
  //   //   }
  //   //   autoUpdater.quitAndInstall(false);
  //   // });
  // });

  // autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "A new version has been downloaded. Restart the application to apply the updates.",
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.autoInstallOnAppQuit();
    // autoUpdater.autoInstallOnAppQuit = true;
    // .quitAndInstall();

    // autoUpdater.autoInstallOnAppQuit = true;
    // app.quit();

    // setImmediate(() => {
    //   app.removeAllListeners("window-all-closed");
    //   if (mainWindow != null) {
    //     mainWindow.close();
    //   }
    //   autoUpdater.autoInstallOnAppQuit = true;
    //   autoUpdater.quitAndInstall(false);
    // });
  });
});

autoUpdater.on("error", (message) => {
  console.error("There was a problem updating the application");
  console.error(message);
});
