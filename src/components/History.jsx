import React, { useState, useEffect } from 'react';
import './History.css';
import { getRecords, getUniqueDates, deleteRecord, downloadCSV } from '../utils/storageManager';

function History() {
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState('all');
  const [dates, setDates] = useState([]);

  useEffect(() => {
    loadRecords();
  }, [selectedDate]);

  const loadRecords = async () => {
    const allRecords = await getRecords();
    const uniqueDates = await getUniqueDates();
    
    setDates(uniqueDates);
    
    if (selectedDate === 'all') {
      setRecords(allRecords.reverse());
    } else {
      setRecords(allRecords.filter(r => r.date === selectedDate).reverse());
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteRecord(id);
      loadRecords();
    }
  };

  const handleExport = async () => {
    await downloadCSV();
  };

  if (records.length === 0) {
    return (
      <div className="history-container">
        <h2>Sounding History</h2>
        <div className="empty-state">
          <p>No sounding records yet. Calculate some soundings to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Sounding History</h2>
        <div className="history-controls">
          <select 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-filter"
          >
            <option value="all">All Dates</option>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          <button onClick={handleExport} className="btn-export">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      <div className="records-list">
        {records.map(record => (
          <div key={record.id} className="record-card">
            <div className="record-header">
              <div className="record-datetime">
                <span className="record-date">{record.date}</span>
                <span className="record-time">{record.time}</span>
              </div>
              <button 
                onClick={() => handleDelete(record.id)} 
                className="btn-delete"
                title="Delete record"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="record-summary">
              <div className="summary-item">
                <span className="summary-label">Total Volume:</span>
                <span className="summary-value">{record.totalVolume.toFixed(3)} tonnes</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Tanks Measured:</span>
                <span className="summary-value">{Object.keys(record.results).length}</span>
              </div>
            </div>

            <div className="record-details">
              <table className="tank-table">
                <thead>
                  <tr>
                    <th>Tank</th>
                    <th>Sounding (cm)</th>
                    <th>Volume (tonnes)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(record.results).map(([tankName, data]) => (
                    <tr key={tankName}>
                      <td>{data.tankInfo.name}</td>
                      <td>{data.sounding.toFixed(1)}</td>
                      <td>{data.volume.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
