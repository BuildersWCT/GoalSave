import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExportService, Goal, ExportOptions } from '../utils/export';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './ExportControls.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExportControlsProps {
  goals: Goal[];
  className?: string;
}

export function ExportControls({ goals, className = '' }: ExportControlsProps) {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeCharts: true,
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

  const chartData = ExportService.generateProgressChartData(goals, {
    ...exportOptions,
    includeCharts: true,
  });

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
              />
              {t('includeChartsInExport')}
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

      {exportOptions.includeCharts && stats.totalGoals > 0 && (
        <div className="export-controls__chart">
          <h4>{t('goalProgressChart')}</h4>
          <div className="chart-container">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: t('goalProgressOverview'),
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      },
                    },
                  },
                },
              }}
            />
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