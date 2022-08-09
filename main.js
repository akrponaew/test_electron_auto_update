require('update-electron-app')()
const {
  app,
  BrowserWindow,
  ipcMain,
  autoUpdater,
  dialog,
} = require("electron");

const server = "https://your-deployment-url.com";
const url = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL({ url });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.maximize();
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();

  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: app.getVersion(),
    detail: "from ready",
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {});

  autoUpdater.checkForUpdates();
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

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: app.getVersion(),
    detail: "from update-available",
  };

  // win.once("ready-to-show", () => {
  dialog.showMessageBox(dialogOpts).then((returnValue) => {});
  // });

  mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
