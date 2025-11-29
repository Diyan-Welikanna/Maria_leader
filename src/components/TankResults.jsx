import React from 'react';
import './TankResults.css';

function TankResults({ results }) {
  const tankEntries = Object.entries(results);
  
  // Calculate total volume
  const totalVolume = tankEntries.reduce((sum, [, data]) => sum + data.volume, 0);
  
  return (
    <div className="results-container">
      <h2>Calculation Results</h2>
      
      <div className="total-summary">
        <div className="total-card">
          <h3>Total Fresh Water</h3>
          <p className="total-value">{totalVolume.toFixed(3)} tonnes</p>
          <p className="total-label">{tankEntries.length} tank{tankEntries.length !== 1 ? 's' : ''} measured</p>
        </div>
      </div>

      <div className="results-grid">
        {tankEntries.map(([tankName, data]) => (
          <div key={tankName} className="result-card">
            <h4>{data.tankInfo.name}</h4>
            <div className="result-details">
              <div className="detail-row">
                <span className="detail-label">Sounding:</span>
                <span className="detail-value">{data.sounding.toFixed(1)} cm</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Volume:</span>
                <span className="detail-value volume">{data.volume.toFixed(3)} tonnes</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(data.volume / data.tankInfo.maxVolume) * 100}%` }}
                ></div>
              </div>
              <p className="capacity-info">
                {((data.volume / data.tankInfo.maxVolume) * 100).toFixed(1)}% of capacity
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TankResults;
