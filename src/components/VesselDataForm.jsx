import React, { useState } from 'react';
import './VesselDataForm.css';

function VesselDataForm({ onCalculate }) {
  const [formData, setFormData] = useState({
    vesselName: '',
    length: '',
    beam: '',
    draft: '',
    displacement: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleReset = () => {
    setFormData({
      vesselName: '',
      length: '',
      beam: '',
      draft: '',
      displacement: '',
    });
  };

  return (
    <div className="vessel-form-container">
      <h2>Vessel Data Entry</h2>
      <form onSubmit={handleSubmit} className="vessel-form">
        <div className="form-group">
          <label htmlFor="vesselName">Vessel Name:</label>
          <input
            type="text"
            id="vesselName"
            name="vesselName"
            value={formData.vesselName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="length">Length (m):</label>
          <input
            type="number"
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="beam">Beam (m):</label>
          <input
            type="number"
            id="beam"
            name="beam"
            value={formData.beam}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="draft">Draft (m):</label>
          <input
            type="number"
            id="draft"
            name="draft"
            value={formData.draft}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="displacement">Displacement (tonnes):</label>
          <input
            type="number"
            id="displacement"
            name="displacement"
            value={formData.displacement}
            onChange={handleChange}
            step="0.01"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-calculate">Calculate</button>
          <button type="button" onClick={handleReset} className="btn-reset">Reset</button>
        </div>
      </form>
    </div>
  );
}

export default VesselDataForm;
