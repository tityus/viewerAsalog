import { app, BrowserWindow } from 'electron';

// Init variable that will contain our app
let window: BrowserWindow;

// Create the browser window.
function createWindow(): void {
  // Size definition for window app (1024px x 768px)
  window = new BrowserWindow({
    width: 1024,
    height: 768
  });

  // Load file from angular dist
  window.loadURL(`file://${__dirname}/../../dist/index.html`);

  // For dev mode
  // window.webContents.openDevTools();

  // When window is closed
  window.on('closed', (): void => window = null);
}

// Emitted when Electron is initialised
app.on('ready', createWindow);

// Emitted when app is activated
app.on('activate', (): void => {
  if (window === null) createWindow();
});

// Emitted when all windows are closed
app.on('window-all-closed', (): void => {
  // MacOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
