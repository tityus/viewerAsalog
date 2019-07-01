"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// Init variable that will contain our app
var window;
// Create the browser window.
function createWindow() {
    // Size definition for window app (1024px x 768px)
    window = new electron_1.BrowserWindow({
        width: 1024,
        height: 768
    });
    // Load file from angular dist
    window.loadURL("file://" + __dirname + "/../../dist/index.html");
    // For dev mode
    // window.webContents.openDevTools();
    // When window is closed
    window.on('closed', function () { return window = null; });
}
// Emitted when Electron is initialised
electron_1.app.on('ready', createWindow);
// Emitted when app is activated
electron_1.app.on('activate', function () {
    if (window === null)
        createWindow();
});
// Emitted when all windows are closed
electron_1.app.on('window-all-closed', function () {
    // MacOS specific close process
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=index.js.map