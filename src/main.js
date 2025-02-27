import { app, BrowserWindow, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";
import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const logFile = path.resolve(app.getPath("home"), "time.log.txt");
console.log("日志文件：", logFile);
const hasHead =
  fs.existsSync(logFile) &&
  fs.readFileSync(logFile, "utf8").includes("navigationStart");
if (!hasHead) {
  fs.appendFileSync(logFile, "navigationStart|firstPaint\n");
  fs.appendFileSync(logFile, "--:|:--\n");
}

const initTime = Date.now();
const handleRendererLoaded = async () => initTime;
const handleTimeReport = (_, key, value) => {
  let time = value;
  if (key === "ns") time = `${value - initTime}|`;
  else if (key === "fp") time = `${value}\n`;

  console.log(key, time);
  fs.appendFileSync(logFile, time);
};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.handle("renderer:loaded", handleRendererLoaded);
  ipcMain.on("time:report", handleTimeReport);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
