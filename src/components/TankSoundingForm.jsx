import React, { useState } from 'react';
import './TankSoundingForm.css';
import { getTankData, getSoundingVolume, TANK_INFO } from '../data/soundingData';

function TankSoundingForm({ onCalculate, onReset }) {
  const [soundings, setSoundings] = useState({
    TANK_1_PORT: '',
    TANK_1_STARBOARD: '',
    TANK_2_PORT: '',
    TANK_2_STARBOARD: '',
    TANK_3_PORT: '',
    TANK_3_STARBOARD: '',
    TANK_3_CENTER: ''
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSoundings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate volumes for each tank
    const results = {};
    Object.keys(soundings).forEach(tankName => {
      const sounding = parseFloat(soundings[tankName]);
      if (!isNaN(sounding) && sounding >= 0) {
        const tankData = getTankData(tankName);
        const volume = getSoundingVolume(tankData, sounding);
        results[tankName] = {
          sounding,
          volume,
          tankInfo: TANK_INFO[tankName]
        };
      }
    });
    
    onCalculate(results, selectedDate);
  };

  const handleReset = () => {
    setSoundings({
      TANK_1_PORT: '',
      TANK_1_STARBOARD: '',
      TANK_2_PORT: '',
      TANK_2_STARBOARD: '',
      TANK_3_PORT: '',
      TANK_3_STARBOARD: '',
      TANK_3_CENTER: ''
    });
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="tank-form-container">
      <h2>Tank Soundings Entry</h2>
      <p className="form-subtitle">Enter sounding measurements in centimeters (cm)</p>
      
      <form onSubmit={handleSubmit} className="tank-form">
        <div className="date-section">
          <div className="form-group">
            <label htmlFor="soundingDate">
              <svg className="label-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Sounding Date
            </label>
            <input
              type="date"
              id="soundingDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="tank-section">
          <h3>Tank No. 1</h3>
          <div className="tank-inputs">
            <div className="form-group">
              <label htmlFor="TANK_1_PORT">
                Port (P/S)
                <span className="max-info">Max: 438 cm</span>
              </label>
              <input
                type="number"
                id="TANK_1_PORT"
                name="TANK_1_PORT"
                value={soundings.TANK_1_PORT}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="438"
                placeholder="0.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="TANK_1_STARBOARD">
                Starboard (P/S)
                <span className="max-info">Max: 436 cm</span>
              </label>
              <input
                type="number"
                id="TANK_1_STARBOARD"
                name="TANK_1_STARBOARD"
                value={soundings.TANK_1_STARBOARD}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="436"
                placeholder="0.0"
              />
            </div>
          </div>
        </div>

        <div className="tank-section">
          <h3>Tank No. 2</h3>
          <div className="tank-inputs">
            <div className="form-group">
              <label htmlFor="TANK_2_PORT">
                Port (P/S)
                <span className="max-info">Max: 170 cm</span>
              </label>
              <input
                type="number"
                id="TANK_2_PORT"
                name="TANK_2_PORT"
                value={soundings.TANK_2_PORT}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="170"
                placeholder="0.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="TANK_2_STARBOARD">
                Starboard (P/S)
                <span className="max-info">Max: 170 cm</span>
              </label>
              <input
                type="number"
                id="TANK_2_STARBOARD"
                name="TANK_2_STARBOARD"
                value={soundings.TANK_2_STARBOARD}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="170"
                placeholder="0.0"
              />
            </div>
          </div>
        </div>

        <div className="tank-section">
          <h3>Tank No. 3</h3>
          <div className="tank-inputs three-tanks">
            <div className="form-group">
              <label htmlFor="TANK_3_PORT">
                Port (P/S)
                <span className="max-info">Max: 180 cm</span>
              </label>
              <input
                type="number"
                id="TANK_3_PORT"
                name="TANK_3_PORT"
                value={soundings.TANK_3_PORT}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="180"
                placeholder="0.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="TANK_3_CENTER">
                Center
                <span className="max-info">Max: 298 cm</span>
              </label>
              <input
                type="number"
                id="TANK_3_CENTER"
                name="TANK_3_CENTER"
                value={soundings.TANK_3_CENTER}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="298"
                placeholder="0.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="TANK_3_STARBOARD">
                Starboard (P/S)
                <span className="max-info">Max: 180 cm</span>
              </label>
              <input
                type="number"
                id="TANK_3_STARBOARD"
                name="TANK_3_STARBOARD"
                value={soundings.TANK_3_STARBOARD}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="180"
                placeholder="0.0"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-calculate">Calculate Volumes</button>
          <button type="button" onClick={handleReset} className="btn-reset">Reset All</button>
        </div>
      </form>
    </div>
  );
}

export default TankSoundingForm;
