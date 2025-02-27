// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getMainInitTime: () => ipcRenderer.invoke("renderer:loaded"),
  reportTime: (key, value) => ipcRenderer.send("time:report", key, value),
});
