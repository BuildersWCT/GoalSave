import jsPDF from 'jspdf';
import Papa from 'papaparse';

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

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `goals-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export goals to PDF report
   */
  static exportToPDF(goals: Goal[], options: ExportOptions = { includeCharts: true, includeArchived: true }): void {
    const doc = new jsPDF();
    const filteredGoals = options.includeArchived ? goals : goals.filter(goal => !goal.archived);

    // Header
    doc.setFontSize(20);
    doc.text('GoalSave Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 35);
    doc.text(`Total Goals: ${filteredGoals.length}`, 20, 45);

    let yPosition = 60;

    // Summary statistics
    const activeGoals = filteredGoals.filter(g => !g.archived && !g.closed);
    const closedGoals = filteredGoals.filter(g => g.closed);
    const archivedGoals = filteredGoals.filter(g => g.archived);
    
    doc.setFontSize(14);
    doc.text('Summary', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Active Goals: ${activeGoals.length}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Closed Goals: ${closedGoals.length}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Archived Goals: ${archivedGoals.length}`, 20, yPosition);
    yPosition += 15;

    // Goals table
    if (filteredGoals.length > 0) {
      doc.setFontSize(14);
      doc.text('Goals Details', 20, yPosition);
      yPosition += 10;

      // Table headers
      doc.setFontSize(8);
      const headers = ['Name', 'Target', 'Balance', 'Progress', 'Status'];
      let xPosition = 20;
      
      headers.forEach(header => {
        doc.text(header, xPosition, yPosition);
        xPosition += 35;
      });
      yPosition += 5;

      // Table rows
      filteredGoals.forEach((goal) => {
        if (yPosition > 270) { // Add new page if needed
          doc.addPage();
          yPosition = 20;
        }

        xPosition = 20;
        const progress = this.calculateProgress(goal);
        const rowData = [
          goal.name.substring(0, 12), // Truncate long names
          goal.target.toString().substring(0, 8),
          goal.balance.toString().substring(0, 8),
          `${progress.toFixed(1)}%`,
          goal.closed ? 'Closed' : 'Active'
        ];

        rowData.forEach(data => {
          doc.text(data, xPosition, yPosition);
          xPosition += 35;
        });
        yPosition += 5;
      });
    }

    // Add chart if requested and goals exist
    if (options.includeCharts && filteredGoals.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Goal Progress Chart', 20, 20);
      
      // Create a simple progress chart representation
      yPosition = 40;
      doc.setFontSize(10);
      
      filteredGoals.slice(0, 10).forEach((goal) => { // Limit to first 10 for readability
        const progress = this.calculateProgress(goal);
        const barWidth = (progress / 100) * 100;
        
        // Draw progress bar background
        doc.rect(20, yPosition, 100, 5);
        
        // Draw progress bar
        doc.setFillColor(0, 123, 255);
        doc.rect(20, yPosition, barWidth, 5, 'F');
        
        // Label
        doc.text(`${goal.name.substring(0, 15)} (${progress.toFixed(1)}%)`, 125, yPosition + 4);
        
        yPosition += 10;
      });
    }

    doc.save(`goals-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  /**
   * Generate chart data for React-ChartJS-2
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