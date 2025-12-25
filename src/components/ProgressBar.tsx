import React from 'react'
import './ProgressBar.css'

interface ProgressBarProps {
  percentage: number
  className?: string
}

/**
 * ProgressBar component for visualizing goal completion percentage
 * Features smooth animations and accessibility attributes
 */
export function ProgressBar({ percentage, className = '' }: ProgressBarProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  return (
    <div
      className={`progress-bar ${className}`}
      role="progressbar"
      aria-valuenow={clampedPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${clampedPercentage.toFixed(1)}%`}
    >
      <div
        className="progress-fill"
        style={{ width: `${clampedPercentage}%` }}
      />
      <span className="progress-text">{clampedPercentage.toFixed(1)}%</span>
    </div>
  )
}