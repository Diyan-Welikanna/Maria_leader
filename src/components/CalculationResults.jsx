import React from 'react';
import './CalculationResults.css';

function CalculationResults({ results, vesselData }) {
  return (
    <div className="results-container">
      <h2>Calculation Results</h2>
      
      <div className="vessel-info">
        <h3>Vessel: {vesselData.vesselName}</h3>
        <p>Length: {vesselData.length} m | Beam: {vesselData.beam} m | Draft: {vesselData.draft} m</p>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <h4>Calculated Displacement</h4>
          <p className="result-value">{results.displacement.toFixed(2)} tonnes</p>
        </div>

        <div className="result-card">
          <h4>Volume</h4>
          <p className="result-value">{results.volume.toFixed(2)} m³</p>
        </div>

        {/* Add more result cards as needed */}
      </div>

      <div className="results-note">
        <p><em>Note: These are example calculations. Replace with your actual vessel calculation formulas.</em></p>
      </div>
    </div>
  );
}

export default CalculationResults;
