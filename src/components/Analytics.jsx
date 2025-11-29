import React, { useState, useEffect } from 'react';
import './Analytics.css';
import { getRecords } from '../utils/storageManager';
import { TANK_INFO } from '../data/soundingData';

function Analytics() {
  const [weeklyData, setWeeklyData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7'); // days

  useEffect(() => {
    calculateWeeklyUsage();
  }, [selectedPeriod]);

  const calculateWeeklyUsage = async () => {
    const records = await getRecords();
    
    if (records.length === 0) {
      setWeeklyData(null);
      return;
    }

    // Sort records by timestamp
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Filter records for selected period (last N days from now)
    const daysAgo = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    const periodRecords = sortedRecords.filter(record => 
      new Date(record.timestamp) >= cutoffDate
    );

    if (periodRecords.length === 0) {
      setWeeklyData(null);
      return;
    }

    // Get date range
    const firstRecord = periodRecords[0];
    const lastRecord = periodRecords[periodRecords.length - 1];

    // Group records by date to get unique days
    const recordsByDate = {};
    periodRecords.forEach(record => {
      const dateKey = record.date;
      if (!recordsByDate[dateKey]) {
        recordsByDate[dateKey] = [];
      }
      recordsByDate[dateKey].push(record);
    });

    const uniqueDays = Object.keys(recordsByDate).length;

    if (uniqueDays === 0) {
      setWeeklyData(null);
      return;
    }

    // Calculate average usage for each tank
    const tankUsage = {};
    
    Object.keys(TANK_INFO).forEach(tankKey => {
      // Sum all volumes for this tank across all records in the period
      let totalVolume = 0;
      periodRecords.forEach(record => {
        totalVolume += record.results[tankKey]?.volume || 0;
      });
      
      // Calculate average daily volume
      const averageVolume = totalVolume / periodRecords.length;
      
      // Get first and last volumes to show usage trend
      const firstVolume = firstRecord.results[tankKey]?.volume || 0;
      const lastVolume = lastRecord.results[tankKey]?.volume || 0;
      const totalUsage = firstVolume - lastVolume;
      
      // Calculate time span for daily usage rate
      const timeDiff = new Date(lastRecord.timestamp) - new Date(firstRecord.timestamp);
      const daysDiff = Math.max(1, timeDiff / (1000 * 60 * 60 * 24));
      const dailyUsage = totalUsage / daysDiff;
      
      tankUsage[tankKey] = {
        name: TANK_INFO[tankKey].name,
        firstVolume,
        lastVolume,
        averageVolume,
        totalUsage,
        dailyUsage,
        maxCapacity: TANK_INFO[tankKey].maxVolume
      };
    });

    // Calculate total usage and averages
    let totalVolumeSum = 0;
    periodRecords.forEach(record => {
      const recordTotal = Object.values(record.results).reduce((sum, tank) => sum + (tank.volume || 0), 0);
      totalVolumeSum += recordTotal;
    });
    
    const averageTotalVolume = totalVolumeSum / periodRecords.length;
    
    const totalFirstVolume = Object.values(firstRecord.results).reduce((sum, tank) => sum + (tank.volume || 0), 0);
    const totalLastVolume = Object.values(lastRecord.results).reduce((sum, tank) => sum + (tank.volume || 0), 0);
    const totalUsage = totalFirstVolume - totalLastVolume;
    
    const timeDiff = new Date(lastRecord.timestamp) - new Date(firstRecord.timestamp);
    const daysDiff = Math.max(1, timeDiff / (1000 * 60 * 60 * 24));
    const totalDailyUsage = totalUsage / daysDiff;

    setWeeklyData({
      startDate: firstRecord.date,
      endDate: lastRecord.date,
      days: daysDiff.toFixed(1),
      uniqueDays,
      selectedPeriod: daysAgo,
      tankUsage,
      totalUsage,
      totalDailyUsage,
      averageTotalVolume,
      recordCount: periodRecords.length
    });
  };

  if (!weeklyData) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h2>Usage Analytics</h2>
        </div>
        <div className="empty-analytics">
          <p>Not enough data to calculate usage statistics.</p>
          <p>Add at least 2 sounding records over different days to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Usage Analytics</h2>
        <div className="period-selector">
          <label>Period:</label>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="period-info">
        <div className="info-card">
          <span className="info-label">Period</span>
          <span className="info-value">{weeklyData.startDate} - {weeklyData.endDate}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Time Span</span>
          <span className="info-value">{weeklyData.days} days</span>
        </div>
        <div className="info-card">
          <span className="info-label">Unique Days</span>
          <span className="info-value">{weeklyData.uniqueDays}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Total Records</span>
          <span className="info-value">{weeklyData.recordCount}</span>
        </div>
      </div>

      <div className="total-usage-card">
        <h3>Total Water Statistics</h3>
        <div className="usage-stats">
          <div className="stat-item">
            <span className="stat-label">Average Volume</span>
            <span className="stat-value">{weeklyData.averageTotalVolume.toFixed(3)} tonnes</span>
          </div>
          <div className="stat-item highlight">
            <span className="stat-label">Total Consumed</span>
            <span className="stat-value">{weeklyData.totalUsage.toFixed(3)} tonnes</span>
          </div>
          <div className="stat-item highlight">
            <span className="stat-label">Daily Usage Rate</span>
            <span className="stat-value">{weeklyData.totalDailyUsage.toFixed(3)} t/day</span>
          </div>
        </div>
      </div>

      <div className="tanks-grid">
        {Object.entries(weeklyData.tankUsage).map(([tankKey, data]) => (
          <div key={tankKey} className="tank-usage-card">
            <h4>{data.name}</h4>
            
            <div className="usage-details">
              <div className="detail-row">
                <span className="detail-label">Average Volume:</span>
                <span className="detail-value">{data.averageVolume.toFixed(3)} t</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Start Volume:</span>
                <span className="detail-value">{data.firstVolume.toFixed(3)} t</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">End Volume:</span>
                <span className="detail-value">{data.lastVolume.toFixed(3)} t</span>
              </div>
              <div className="detail-row highlight">
                <span className="detail-label">Total Used:</span>
                <span className="detail-value">{data.totalUsage.toFixed(3)} t</span>
              </div>
              <div className="detail-row highlight">
                <span className="detail-label">Daily Usage Rate:</span>
                <span className="detail-value">{data.dailyUsage.toFixed(3)} t/day</span>
              </div>
            </div>

            <div className="usage-bar">
              <div 
                className="usage-fill"
                style={{ 
                  width: `${Math.min(100, Math.abs((data.totalUsage / data.maxCapacity) * 100))}%` 
                }}
              />
            </div>
            <div className="usage-percentage">
              {Math.abs((data.totalUsage / data.maxCapacity) * 100).toFixed(1)}% of capacity
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-note">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p><strong>Average Volume:</strong> Mean of all recorded volumes in the period. <strong>Daily Usage Rate:</strong> Total consumption divided by time span between first and last records. <strong>Total Used:</strong> Difference between first and last recorded volumes.</p>
      </div>
    </div>
  );
}

export default Analytics;
