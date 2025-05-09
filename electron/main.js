const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const url = require('url');
const Store = require('electron-store');
const http = require('http');

// Initialize the persistent storage
const store = new Store();

// Keep a global reference of the window object
let mainWindow;

// Set environment variables
const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const appUrl = isDev 
  ? `http://localhost:${port}` 
  : url.format({
      pathname: path.join(__dirname, '../.next/index.html'),
      protocol: 'file:',
      slashes: true,
    });

// Function to check if the development server is ready
function checkServerReady() {
  return new Promise((resolve) => {
    const checkServer = () => {
      http.get(`http://localhost:${port}`, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          setTimeout(checkServer, 100);
        }
      }).on('error', () => {
        setTimeout(checkServer, 100);
      });
    };
    
    checkServer();
  });
}

async function createWindow() {
  // In development mode, wait for the dev server to be ready
  if (isDev) {
    console.log('Waiting for Next.js development server to be ready...');
    await checkServerReady();
    console.log('Next.js development server is ready!');
  }

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icons/icon.png'),
    show: false,
    backgroundColor: '#000000',
  });

  // Load the app
  mainWindow.loadURL(appUrl);

  // Only show window when it's ready to avoid flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// Create the application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Settings',
          click: () => mainWindow.webContents.send('navigate', '/settings')
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Support',
          click: () => mainWindow.webContents.send('navigate', '/support')
        },
        { 
          label: 'About SmartPC',
          click: () => mainWindow.webContents.send('show-about')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for communication between renderer and main process
ipcMain.handle('get-store-value', (event, key) => {
  console.log(`Getting store value for key "${key}": ${store.get(key)}`);
  return store.get(key);
});

ipcMain.handle('set-store-value', (event, key, value) => {
  console.log(`Setting store value for key "${key}": ${value}`);
  store.set(key, value);
  return true;
});

ipcMain.handle('delete-store-value', (event, key) => {
  store.delete(key);
  return true;
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Additional handlers can be added here 