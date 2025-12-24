import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExportService, Goal, ExportOptions } from '../utils/export';
import './ExportControls.css';

interface ExportControlsProps {
  goals: Goal[];
  className?: string;
}

export function ExportControls({ goals, className = '' }: ExportControlsProps) {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeCharts: false, // Disabled by default due to dependency issues
    includeArchived: true,
  });
  const [showOptions, setShowOptions] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (goals.length === 0) {
      alert(t('noGoalsToExport'));
      return;
    }

    setIsExporting(true);
    try {
      if (format === 'csv') {
        ExportService.exportToCSV(goals, exportOptions);
      } else {
        ExportService.exportToPDF(goals, exportOptions);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('exportFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  const stats = ExportService.getExportStats(goals, exportOptions);

  return (
    <div className={`export-controls ${className}`}>
      <div className="export-controls__header">
        <h3>{t('exportGoals')}</h3>
        <button
          type="button"
          className="export-controls__toggle"
          onClick={() => setShowOptions(!showOptions)}
          aria-expanded={showOptions}
          aria-label={showOptions ? t('hideOptions') : t('showOptions')}
        >
          ⚙️
        </button>
      </div>

      {showOptions && (
        <div className="export-controls__options">
          <div className="export-option">
            <label>
              <input
                type="checkbox"
                checked={exportOptions.includeArchived}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    includeArchived: e.target.checked,
                  })
                }
              />
              {t('includeArchivedGoals')}
            </label>
          </div>
          
          <div className="export-option">
            <label>
              <input
                type="checkbox"
                checked={exportOptions.includeCharts}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    includeCharts: e.target.checked,
                  })
                }
                disabled // Disabled due to missing dependencies
              />
              {t('includeChartsInExport')} (Beta)
            </label>
          </div>
        </div>
      )}

      <div className="export-controls__stats">
        <div className="export-stats">
          <div className="stat-item">
            <span className="stat-label">{t('totalGoals')}:</span>
            <span className="stat-value">{stats.totalGoals}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('activeGoals')}:</span>
            <span className="stat-value">{stats.activeGoals}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('closedGoals')}:</span>
            <span className="stat-value">{stats.closedGoals}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('avgProgress')}:</span>
            <span className="stat-value">{stats.avgProgress}%</span>
          </div>
        </div>
      </div>

      {/* Simple progress visualization */}
      {goals.length > 0 && (
        <div className="export-controls__chart">
          <h4>{t('goalProgressChart')}</h4>
          <div className="chart-container">
            {goals.slice(0, 5).map((goal) => {
              const actualProgress = Math.min((Number(goal.balance) / Number(goal.target)) * 100, 100);
              
              return (
                <div key={goal.id.toString()} className="progress-bar-item">
                  <div className="progress-label">{goal.name.substring(0, 15)}</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${actualProgress}%`,
                        backgroundColor: actualProgress >= 100 ? '#22c55e' : actualProgress >= 50 ? '#3b82f6' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div className="progress-value">{actualProgress.toFixed(1)}%</div>
                </div>
              );
            })}
            {goals.length > 5 && (
              <div className="more-goals">... and {goals.length - 5} more goals</div>
            )}
          </div>
        </div>
      )}

      <div className="export-controls__actions">
        <button
          type="button"
          className="export-btn export-btn--csv"
          onClick={() => handleExport('csv')}
          disabled={isExporting || goals.length === 0}
        >
          {isExporting ? t('exporting') : t('exportToCSV')}
        </button>
        
        <button
          type="button"
          className="export-btn export-btn--pdf"
          onClick={() => handleExport('pdf')}
          disabled={isExporting || goals.length === 0}
        >
          {isExporting ? t('exporting') : t('exportToPDF')}
        </button>
      </div>
    </div>
  );
}