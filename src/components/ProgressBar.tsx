import React from 'react'
import './ProgressBar.css'

interface ProgressBarProps {
  percentage: number
  className?: string
}

export function ProgressBar({ percentage, className = '' }: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  return (
    <div className={`progress-bar ${className}`}>
      <div
        className="progress-fill"
        style={{ width: `${clampedPercentage}%` }}
      />
      <span className="progress-text">{clampedPercentage.toFixed(1)}%</span>
    </div>
  )
}