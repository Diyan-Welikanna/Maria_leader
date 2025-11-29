// Storage manager for sounding records
// Uses both localStorage (backup) and file system (primary)

const STORAGE_KEY = 'vessel_sounding_records';

// Check if running in Electron
const isElectron = () => {
  return window && window.electronAPI;
};

export const saveRecord = async (soundings, results, customDate = null) => {
  const recordDate = customDate ? new Date(customDate) : new Date();
  
  const record = {
    id: Date.now(),
    timestamp: recordDate.toISOString(),
    date: recordDate.toLocaleDateString('en-GB'),
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    soundings,
    results,
    totalVolume: Object.values(results).reduce((sum, tank) => sum + tank.volume, 0)
  };
  
  // Save to localStorage as backup
  const records = getRecordsFromLocalStorage();
  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  // Save to file if in Electron
  if (isElectron()) {
    try {
      await window.electronAPI.saveRecord(record);
    } catch (error) {
      console.error('Error saving to file:', error);
    }
  }
  
  return record;
};

const getRecordsFromLocalStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getRecords = async () => {
  // Try to load from file first (Electron)
  if (isElectron()) {
    try {
      const fileRecords = await window.electronAPI.loadRecords();
      if (fileRecords && fileRecords.length > 0) {
        // Sync to localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fileRecords));
        return fileRecords;
      }
    } catch (error) {
      console.error('Error loading from file:', error);
    }
  }
  
  // Fallback to localStorage
  return getRecordsFromLocalStorage();
};

export const getRecordsByDate = async (date) => {
  const records = await getRecords();
  return records.filter(record => record.date === date);
};

export const getUniqueDates = async () => {
  const records = await getRecords();
  const dates = records.map(record => record.date);
  return [...new Set(dates)].sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'));
    const dateB = new Date(b.split('/').reverse().join('-'));
    return dateB - dateA;
  });
};

export const deleteRecord = async (id) => {
  const records = await getRecords();
  const filtered = records.filter(record => record.id !== id);
  
  // Update localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  // Update file if in Electron
  if (isElectron()) {
    try {
      await window.electronAPI.saveAllRecords(filtered);
    } catch (error) {
      console.error('Error deleting from file:', error);
    }
  }
};

export const exportToCSV = async () => {
  const records = await getRecords();
  
  if (records.length === 0) return null;
  
  // CSV Headers
  const headers = [
    'Date',
    'Time',
    'Tank 1 Port (cm)',
    'Tank 1 Starboard (cm)',
    'Tank 2 Port (cm)',
    'Tank 2 Starboard (cm)',
    'Tank 3 Port (cm)',
    'Tank 3 Center (cm)',
    'Tank 3 Starboard (cm)',
    'Total Volume (tonnes)'
  ];
  
  // CSV Rows
  const rows = records.map(record => {
    const tanks = record.results;
    return [
      record.date,
      record.time,
      tanks.TANK_1_PORT?.sounding.toFixed(1) || '-',
      tanks.TANK_1_STARBOARD?.sounding.toFixed(1) || '-',
      tanks.TANK_2_PORT?.sounding.toFixed(1) || '-',
      tanks.TANK_2_STARBOARD?.sounding.toFixed(1) || '-',
      tanks.TANK_3_PORT?.sounding.toFixed(1) || '-',
      tanks.TANK_3_CENTER?.sounding.toFixed(1) || '-',
      tanks.TANK_3_STARBOARD?.sounding.toFixed(1) || '-',
      record.totalVolume.toFixed(3)
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = async () => {
  const csvContent = await exportToCSV();
  
  if (!csvContent) {
    alert('No records to export');
    return;
  }
  
  const filename = `maria_leader.csv`;
  
  // Use Electron save dialog if available
  if (isElectron()) {
    try {
      await window.electronAPI.saveCSV(csvContent, filename);
      return;
    } catch (error) {
      console.error('Error saving CSV:', error);
    }
  }
  
  // Fallback to browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
