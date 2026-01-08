import { ExportService, Goal } from '../export';

describe('ExportService', () => {
  const mockGoals: Goal[] = [
    {
      id: 1n,
      name: 'Emergency Fund',
      token: '0x0000000000000000000000000000000000000000', // CELO
      target: 1000n,
      balance: 500n,
      createdAt: 1609459200n, // 2021-01-01
      lockUntil: 1640995200n, // 2022-01-01
      closed: false,
      archived: false,
    },
    {
      id: 2n,
      name: 'Vacation Fund',
      token: '0x1234567890123456789012345678901234567890',
      target: 2000n,
      balance: 2000n,
      createdAt: 1612137600n, // 2021-02-01
      lockUntil: 0n,
      closed: true,
      archived: false,
    },
    {
      id: 3n,
      name: 'Archived Goal',
      token: '0x0000000000000000000000000000000000000000',
      target: 500n,
      balance: 250n,
      createdAt: 1614556800n, // 2021-03-01
      lockUntil: 0n,
      closed: false,
      archived: true,
    },
  ];

  describe('getExportStats', () => {
    it('should calculate correct statistics for all goals', () => {
      const stats = ExportService.getExportStats(mockGoals, {
        includeCharts: true,
        includeArchived: true,
      });

      expect(stats.totalGoals).toBe(3);
      expect(stats.activeGoals).toBe(1); // Only Emergency Fund
      expect(stats.closedGoals).toBe(1); // Only Vacation Fund
      expect(stats.archivedGoals).toBe(1); // Only Archived Goal
      expect(stats.totalTarget).toBe(3500); // 1000 + 2000 + 500
      expect(stats.totalBalance).toBe(2750); // 500 + 2000 + 250
      expect(stats.avgProgress).toBeGreaterThan(0);
      expect(stats.completionRate).toBeCloseTo(33.33, 1); // 1 closed out of 3 goals
    });

    it('should filter out archived goals when includeArchived is false', () => {
      const stats = ExportService.getExportStats(mockGoals, {
        includeCharts: true,
        includeArchived: false,
      });

      expect(stats.totalGoals).toBe(2); // Excludes archived goal
      expect(stats.archivedGoals).toBe(0);
      expect(stats.totalTarget).toBe(3000); // 1000 + 2000
      expect(stats.totalBalance).toBe(2500); // 500 + 2000
    });
  });

  describe('generateProgressChartData', () => {
    it('should generate correct chart data for all goals', () => {
      const chartData = ExportService.generateProgressChartData(mockGoals, {
        includeCharts: true,
        includeArchived: true,
      });

      expect(chartData.labels).toHaveLength(3);
      expect(chartData.labels).toEqual(['Emergency Fund', 'Vacation Fund', 'Archived Goal']);
      
      expect(chartData.datasets).toHaveLength(1);
      expect(chartData.datasets[0].label).toBe('Progress (%)');
      expect(chartData.datasets[0].data).toHaveLength(3);
      
      // Emergency Fund: 500/1000 = 50%
      // Vacation Fund: 2000/2000 = 100%
      // Archived Goal: 250/500 = 50%
      expect(chartData.datasets[0].data).toEqual([50, 100, 50]);
      
      // Check colors are set correctly
      expect(chartData.datasets[0].backgroundColor).toHaveLength(3);
      expect(chartData.datasets[0].borderColor).toHaveLength(3);
    });

    it('should filter archived goals when includeArchived is false', () => {
      const chartData = ExportService.generateProgressChartData(mockGoals, {
        includeCharts: true,
        includeArchived: false,
      });

      expect(chartData.labels).toHaveLength(2);
      expect(chartData.labels).toEqual(['Emergency Fund', 'Vacation Fund']);
      expect(chartData.datasets[0].data).toEqual([50, 100]);
    });

    it('should handle empty goals array', () => {
      const chartData = ExportService.generateProgressChartData([], {
        includeCharts: true,
        includeArchived: true,
      });

      expect(chartData.labels).toHaveLength(0);
      expect(chartData.datasets[0].data).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle goals with zero target', () => {
      const goalWithZeroTarget: Goal = {
        id: 4n,
        name: 'Zero Target Goal',
        token: '0x0000000000000000000000000000000000000000',
        target: 0n,
        balance: 0n,
        createdAt: 1614556800n,
        lockUntil: 0n,
        closed: false,
        archived: false,
      };

      const chartData = ExportService.generateProgressChartData([goalWithZeroTarget]);
      
      expect(chartData.datasets[0].data).toEqual([0]); // Should handle zero target gracefully
    });

    it('should handle very large numbers', () => {
      const goalWithLargeNumbers: Goal = {
        id: 5n,
        name: 'Large Numbers Goal',
        token: '0x0000000000000000000000000000000000000000',
        target: 999999999999999999999n, // Very large number
        balance: 500000000000000000000n, // Half of target
        createdAt: 1614556800n,
        lockUntil: 0n,
        closed: false,
        archived: false,
      };

      const stats = ExportService.getExportStats([goalWithLargeNumbers]);
      
      expect(stats.avgProgress).toBeCloseTo(50, 1); // Should calculate progress correctly
    });
  });
});