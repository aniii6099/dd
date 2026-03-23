import React from "react";

/**
 * AlertBanner — shows a warning strip when an alert is active.
 *
 * Props:
 *   alert {string} - Alert message. If "NORMAL" or empty, banner is hidden.
 */
const AlertBanner = ({ alert }) => {
  if (!alert || alert === "NORMAL") return null;

  const icons = {
    "LOW OXYGEN": "🫁",
    "HIGH HEART RATE": "❤️",
    "FALL DETECTED": "🚨",
  };

  const icon = icons[alert] || "⚠️";

  return (
    <div className="alert-banner">
      <span className="alert-banner__icon">{icon}</span>
      <span className="alert-banner__text">ALERT: {alert}</span>
      <span className="alert-banner__pulse" />
    </div>
  );
};

export default AlertBanner;
