import React, { useState } from 'react';
import './SoundingTables.css';
import { getTankData, TANK_INFO } from '../data/soundingData';

function SoundingTables() {
  const [selectedTank, setSelectedTank] = useState('TANK_1_PORT');

  const tankOptions = [
    { key: 'TANK_1_PORT', label: 'Tank No. 1 - Port' },
    { key: 'TANK_1_STARBOARD', label: 'Tank No. 1 - Starboard' },
    { key: 'TANK_2_PORT', label: 'Tank No. 2 - Port' },
    { key: 'TANK_2_STARBOARD', label: 'Tank No. 2 - Starboard' },
    { key: 'TANK_3_PORT', label: 'Tank No. 3 - Port' },
    { key: 'TANK_3_CENTER', label: 'Tank No. 3 - Center' },
    { key: 'TANK_3_STARBOARD', label: 'Tank No. 3 - Starboard' }
  ];

  const tankData = getTankData(selectedTank);
  const tankInfo = TANK_INFO[selectedTank];

  // Convert object to array for table display
  const tableData = Object.entries(tankData).map(([sounding, volume]) => ({
    sounding: parseFloat(sounding),
    volume: volume
  }));

  return (
    <div className="sounding-tables-container">
      <div className="tables-header">
        <h2>Sounding Reference Tables</h2>
        <p className="tables-subtitle">Complete calibration data for all fresh water tanks</p>
      </div>

      <div className="tank-selector">
        <label htmlFor="tank-select">Select Tank:</label>
        <select 
          id="tank-select"
          value={selectedTank} 
          onChange={(e) => setSelectedTank(e.target.value)}
        >
          {tankOptions.map(tank => (
            <option key={tank.key} value={tank.key}>{tank.label}</option>
          ))}
        </select>
      </div>

      <div className="tank-info-card">
        <h3>{tankInfo.name}</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Maximum Sounding:</span>
            <span className="info-value">{tankInfo.maxSounding} cm</span>
          </div>
          <div className="info-item">
            <span className="info-label">Maximum Volume:</span>
            <span className="info-value">{tankInfo.maxVolume.toFixed(3)} tonnes</span>
          </div>
          <div className="info-item">
            <span className="info-label">Data Points:</span>
            <span className="info-value">{tableData.length}</span>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="sounding-data-table">
          <thead>
            <tr>
              <th>Sounding (cm)</th>
              <th>Volume (tonnes)</th>
              <th>Volume Rounded (tonnes)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((entry, index) => (
              <tr key={index}>
                <td className="sounding-col">{entry.sounding.toFixed(1)}</td>
                <td className="volume-col">{entry.volume.toFixed(3)}</td>
                <td className="rounded-col">{entry.volume.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-note">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>All soundings are in centimeters (cm). Volumes between data points are calculated using linear interpolation. The rounded column shows values to 2 decimal places for quick reference.</p>
      </div>
    </div>
  );
}

export default SoundingTables;
