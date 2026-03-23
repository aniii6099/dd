import React from 'react';

const MLInsightsPanel = ({ insights }) => {
  if (!insights) return null;

  return (
    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid #2a2a3d', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
      <h3 style={{ color: '#e2e8f0', marginTop: '0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🧠</span> AI & Machine Learning Insights
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Fall Detection */}
        <div style={{ padding: '16px', backgroundColor: '#232336', borderRadius: '8px', borderLeft: '4px solid #b794f4' }}>
          <h4 style={{ color: '#e2e8f0', fontSize: '14px', margin: '0 0 4px 0' }}>Smart Fall Detection</h4>
          <p style={{ color: '#a0aec0', fontSize: '12px', margin: '0 0 12px 0' }}>Algorithm: <i style={{color: '#90cdf4'}}>Random Forest Classifier</i></p>
          <div style={{ 
            color: insights.fall_detection === 'Fall Predicted' ? '#fc8181' : '#68d391', 
            fontWeight: '600', 
            fontSize: '15px' 
          }}>
            {insights.fall_detection === 'Fall Predicted' ? '⚠️ ' : '✅ '}{insights.fall_detection}
          </div>
        </div>

        {/* Anomaly Detection */}
        <div style={{ padding: '16px', backgroundColor: '#232336', borderRadius: '8px', borderLeft: '4px solid #f6ad55' }}>
          <h4 style={{ color: '#e2e8f0', fontSize: '14px', margin: '0 0 4px 0' }}>Health Anomaly Detection</h4>
          <p style={{ color: '#a0aec0', fontSize: '12px', margin: '0 0 12px 0' }}>Algorithm: <i style={{color: '#90cdf4'}}>Isolation Forest</i></p>
          <div style={{ 
            color: insights.anomaly_detection === 'Anomaly Detected' ? '#fc8181' : '#68d391', 
            fontWeight: '600', 
            fontSize: '15px' 
          }}>
            {insights.anomaly_detection === 'Anomaly Detected' ? '⚠️ ' : '✅ '}{insights.anomaly_detection}
          </div>
        </div>

        {/* Early Warning */}
        <div style={{ padding: '16px', backgroundColor: '#232336', borderRadius: '8px', borderLeft: '4px solid #63b3ed' }}>
          <h4 style={{ color: '#e2e8f0', fontSize: '14px', margin: '0 0 4px 0' }}>Early Warning System</h4>
          <p style={{ color: '#a0aec0', fontSize: '12px', margin: '0 0 12px 0' }}>Algorithm: <i style={{color: '#90cdf4'}}>Trend Regression</i></p>
          <div style={{ 
            color: insights.early_warning === 'Trend Stable' ? '#68d391' : '#fbd38d', 
            fontWeight: '600', 
            fontSize: '15px' 
          }}>
            {insights.early_warning === 'Trend Stable' ? '✅ ' : '⏳ '}{insights.early_warning}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MLInsightsPanel;
