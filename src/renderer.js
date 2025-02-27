/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import './index.css';

// const mainInitTime = await window.electronAPI.getMainInitTime();
const { navigationStart } = performance.timing;

new PerformanceObserver((l) => {
  const { startTime } = l.getEntries()[0];

  window.electronAPI.reportTime("ns", navigationStart);
  window.electronAPI.reportTime("fp", startTime);

  const msg = [
    `开始导航时间：${navigationStart}`,
    // `从主进程启动到页面开始导航时间：${navigationStart - mainInitTime}`,
    `首像素渲染时间：${startTime}`,
  ].join("<br/>");
  document.getElementById("timer").innerHTML = msg;
}).observe({ entryTypes: ["paint"] });

console.log(
  '👋 This message is being logged by "renderer.js", included via Vite'
);
