const path = require("path");
const { app, BrowserWindow, screen } = require("electron");
const isDev = require("electron-is-dev");
const server = require("./app.js");

if (!isDev) {
  var AutoLaunch = require("auto-launch");
  var autoLauncher = new AutoLaunch({
    name: "food-storage",
  });

  autoLauncher
    .isEnabled()
    .then(function (isEnabled) {
      if (isEnabled) return;
      autoLauncher.enable();
    })
    .catch(function (err) {
      throw err;
    });
}

const options = isDev
  ? {}
  : {
      frame: false,
      skipTaskbar: true,
      center: true,
      autoHideMenuBar: true,
      resizable: true,
      fullscreen: true,
    };

const createWindow = (path, withExternal) => {
  let win;
  let displays = screen.getAllDisplays();
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
  let externalDisplaySettings = {};

  if (withExternal && externalDisplay) {
    externalDisplaySettings = {
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
    };
  }

  win = new BrowserWindow({
    ...externalDisplaySettings,
    width: 1920,
    height: 1080,
    ...options,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      plugins: false,
    },
  });

  win.loadURL(path);

  if (isDev) {
    let devtools = new BrowserWindow();
    win.webContents.setDevToolsWebContents(devtools.webContents);
    win.webContents.openDevTools({ mode: "detach" });
  }

  win.webContents.on("did-finish-load", () => {
    win.show();
    win.focus();
  });
};

const createWindows = () => {
  createWindow(
    isDev
      ? "http://127.0.0.1:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`,
    false
  );
  createWindow(
    `file://${path.join(__dirname, "../build/video-preview/index.html")}`,
    true
  );
};

app.on("ready", createWindows);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
