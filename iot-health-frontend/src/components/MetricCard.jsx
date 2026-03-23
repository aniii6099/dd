import React from "react";

/**
 * MetricCard — displays a single sensor metric.
 *
 * Props:
 *   label    {string}  - Display label (e.g. "Heart Rate")
 *   value    {number|string} - Current value
 *   unit     {string}  - Unit label (e.g. "BPM")
 *   icon     {string}  - Emoji / icon character
 *   isAlert  {boolean} - If true, card turns red
 */
const MetricCard = ({ label, value, unit, icon, isAlert }) => {
  return (
    <div className={`metric-card ${isAlert ? "metric-card--alert" : ""}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {value !== null && value !== undefined && !Number.isNaN(value) ? value : "--"}
      </div>
      <div className="metric-unit">{unit}</div>
      <div className={`metric-status-dot ${isAlert ? "dot-red" : "dot-green"}`} />
    </div>
  );
};

export default MetricCard;
