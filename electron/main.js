import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

// Get the user data path for storing records
const getDataPath = () => {
  const appDataPath = app.getPath('appData');
  const dataDir = path.join(appDataPath, 'vessel-calculator');
  return path.join(dataDir, 'sounding_records.json');
};

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    const appDataPath = app.getPath('appData');
    const dataDir = path.join(appDataPath, 'vessel-calculator');
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Load records from file
async function loadRecords() {
  try {
    await ensureDataDirectory();
    const dataPath = getDataPath();
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet or is corrupted
    return [];
  }
}

// Save all records to file
async function saveAllRecords(records) {
  try {
    await ensureDataDirectory();
    const dataPath = getDataPath();
    await fs.writeFile(dataPath, JSON.stringify(records, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving records:', error);
    return false;
  }
}

// Save a single record
async function saveRecord(record) {
  const records = await loadRecords();
  records.push(record);
  return await saveAllRecords(records);
}

// Save CSV file with dialog
async function saveCSV(csvContent, defaultFilename) {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Sounding Records',
    defaultPath: defaultFilename,
    filters: [
      { name: 'CSV Files', extensions: ['csv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (filePath) {
    await fs.writeFile(filePath, csvContent, 'utf-8');
    return true;
  }
  return false;
}

function createWindow() {
  const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, '../build/icon.ico')
    : path.join(__dirname, '../build/icon.png');
    
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: iconPath,
    title: 'Fresh Water Tank Calculator'
  });

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('save-record', async (event, record) => {
  return await saveRecord(record);
});

ipcMain.handle('load-records', async () => {
  return await loadRecords();
});

ipcMain.handle('save-all-records', async (event, records) => {
  return await saveAllRecords(records);
});

ipcMain.handle('save-csv', async (event, csvContent, filename) => {
  return await saveCSV(csvContent, filename);
});

ipcMain.handle('get-data-path', () => {
  return getDataPath();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
