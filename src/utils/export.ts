export interface Goal {
  id: bigint;
  name: string;
  token: string;
  target: bigint;
  balance: bigint;
  createdAt: bigint;
  lockUntil: bigint;
  closed: boolean;
  archived: boolean;
}

export interface ExportOptions {
  includeCharts: boolean;
  includeArchived: boolean;
  dateFormat?: string;
}

export class ExportService {
  /**
   * Simple date formatting function
   */
  private static formatDate(timestamp: bigint): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  /**
   * Export goals to CSV format
   */
  static exportToCSV(goals: Goal[], options: ExportOptions = { includeCharts: false, includeArchived: true }): void {
    const filteredGoals = options.includeArchived ? goals : goals.filter(goal => !goal.archived);
    
    const csvData = filteredGoals.map(goal => ({
      ID: goal.id.toString(),
      Name: goal.name,
      Token: goal.token === '0x0000000000000000000000000000000000000000' ? 'CELO' : goal.token,
      Target: goal.target.toString(),
      Balance: goal.balance.toString(),
      Progress: this.calculateProgress(goal).toFixed(2),
      Status: goal.closed ? 'Closed' : 'Active',
      Archived: goal.archived ? 'Yes' : 'No',
      CreatedAt: this.formatDate(goal.createdAt),
      LockUntil: goal.lockUntil > 0n ? this.formatDate(goal.lockUntil) : 'No Lock'
    }));

    const csv = this.convertToCSV(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `goals-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export goals to PDF report (simplified HTML version)
   */
  static exportToPDF(goals: Goal[], options: ExportOptions = { includeCharts: true, includeArchived: true }): void {
    const filteredGoals = options.includeArchived ? goals : goals.filter(goal => !goal.archived);
    
    // Create HTML content for PDF
    let htmlContent = `
      <html>
        <head>
          <title>GoalSave Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; }
            h2 { color: #666; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .progress-bar { background-color: #e0e0e0; height: 20px; border-radius: 10px; }
            .progress-fill { height: 100%; border-radius: 10px; }
            .progress-low { background-color: #ef4444; }
            .progress-medium { background-color: #3b82f6; }
            .progress-high { background-color: #22c55e; }
            .stats { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
            .stat-item { background: #f9f9f9; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>GoalSave Report</h1>
          <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Goals:</strong> ${filteredGoals.length}</p>
    `;

    // Add summary statistics
    const stats = this.getExportStats(goals, options);
    htmlContent += `
          <h2>Summary</h2>
          <div class="stats">
            <div class="stat-item"><strong>Active Goals:</strong> ${stats.activeGoals}</div>
            <div class="stat-item"><strong>Closed Goals:</strong> ${stats.closedGoals}</div>
            <div class="stat-item"><strong>Archived Goals:</strong> ${stats.archivedGoals}</div>
            <div class="stat-item"><strong>Average Progress:</strong> ${stats.avgProgress}%</div>
          </div>
    `;

    // Add goals table
    htmlContent += `
          <h2>Goals Details</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Target</th>
                <th>Balance</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredGoals.forEach(goal => {
      const progress = this.calculateProgress(goal);
      const progressColor = progress >= 100 ? 'progress-high' : progress >= 50 ? 'progress-medium' : 'progress-low';
      
      htmlContent += `
        <tr>
          <td>${goal.name}</td>
          <td>${goal.target.toString()}</td>
          <td>${goal.balance.toString()}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill ${progressColor}" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            ${progress.toFixed(1)}%
          </td>
          <td>${goal.closed ? 'Closed' : 'Active'}</td>
        </tr>
      `;
    });

    htmlContent += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Open in new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      // Fallback: save as HTML file
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `goals-report-${new Date().toISOString().split('T')[0]}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Simple CSV conversion without external dependencies
   */
  private static convertToCSV(data: Record<string, string | number>[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma or quote
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  }

  /**
   * Generate chart data for React-ChartJS-2 (placeholder for future use)
   */
  static generateProgressChartData(goals: Goal[], options: ExportOptions = { includeCharts: true, includeArchived: true }) {
    const filteredGoals = options.includeArchived ? goals : goals.filter(goal => !goal.archived);
    
    const labels = filteredGoals.map(goal => goal.name);
    const progressData = filteredGoals.map(goal => this.calculateProgress(goal));
    
    return {
      labels,
      datasets: [
        {
          label: 'Progress (%)',
          data: progressData,
          backgroundColor: progressData.map(progress => 
            progress >= 100 ? 'rgba(34, 197, 94, 0.8)' : 
            progress >= 50 ? 'rgba(59, 130, 246, 0.8)' : 
            'rgba(239, 68, 68, 0.8)'
          ),
          borderColor: progressData.map(progress => 
            progress >= 100 ? 'rgba(34, 197, 94, 1)' : 
            progress >= 50 ? 'rgba(59, 130, 246, 1)' : 
            'rgba(239, 68, 68, 1)'
          ),
          borderWidth: 1,
        },
      ],
    };
  }

  /**
   * Calculate goal progress percentage
   */
  private static calculateProgress(goal: Goal): number {
    if (goal.target === 0n) return 0;
    const progress = (Number(goal.balance) / Number(goal.target)) * 100;
    return Math.min(progress, 100);
  }

  /**
   * Get export statistics
   */
  static getExportStats(goals: Goal[], options: ExportOptions = { includeCharts: true, includeArchived: true }) {
    const filteredGoals = options.includeArchived ? goals : goals.filter(goal => !goal.archived);
    
    const activeGoals = filteredGoals.filter(g => !g.archived && !g.closed);
    const closedGoals = filteredGoals.filter(g => g.closed);
    const archivedGoals = filteredGoals.filter(g => g.archived);
    
    const totalTarget = filteredGoals.reduce((sum, goal) => sum + Number(goal.target), 0);
    const totalBalance = filteredGoals.reduce((sum, goal) => sum + Number(goal.balance), 0);
    const avgProgress = filteredGoals.length > 0 
      ? filteredGoals.reduce((sum, goal) => sum + this.calculateProgress(goal), 0) / filteredGoals.length 
      : 0;

    return {
      totalGoals: filteredGoals.length,
      activeGoals: activeGoals.length,
      closedGoals: closedGoals.length,
      archivedGoals: archivedGoals.length,
      totalTarget,
      totalBalance,
      avgProgress: Math.round(avgProgress * 100) / 100,
      completionRate: filteredGoals.length > 0 ? (closedGoals.length / filteredGoals.length) * 100 : 0,
    };
  }
}