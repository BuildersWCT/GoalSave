# Export Functionality Documentation

## Overview

The GoalSave application now includes comprehensive export functionality that allows users to export their goals and transaction data in multiple formats with various customization options.

## Features

### Supported Export Formats

1. **CSV Export** - Structured data export for spreadsheet applications
2. **PDF Report** - Formatted reports with charts and statistics

### Export Options

- **Include Charts**: Toggle chart visualization in PDF exports
- **Include Archived Goals**: Control whether archived goals appear in exports
- **Multi-language Support**: All export features support EN, ES, FR, and DE

## Components

### ExportControls

The main export interface component that provides:
- Export statistics display
- Interactive chart visualization
- Configurable export options
- Export action buttons

#### Props
```typescript
interface ExportControlsProps {
  goals: Goal[];
  className?: string;
}
```

#### Features
- Real-time statistics calculation
- Interactive progress charts using Chart.js
- Responsive design with mobile support
- Accessibility features with proper ARIA labels

### ExportService

Core utility class providing export functionality:

#### Methods

##### `exportToCSV(goals: Goal[], options: ExportOptions): void`
Exports goals to CSV format with:
- Goal details (ID, name, token, target, balance)
- Calculated progress percentages
- Status information (active, closed, archived)
- Timestamps in readable format

##### `exportToPDF(goals: Goal[], options: ExportOptions): void`
Generates comprehensive PDF reports including:
- Header with generation timestamp
- Summary statistics
- Goals table with progress information
- Visual progress charts (when enabled)

##### `generateProgressChartData(goals: Goal[], options: ExportOptions)`
Returns Chart.js compatible data structure for:
- Goal names as labels
- Progress percentages as data
- Color-coded progress bars (green ≥100%, blue ≥50%, red <50%)

##### `getExportStats(goals: Goal[], options: ExportOptions)`
Calculates comprehensive statistics:
- Total, active, closed, and archived goal counts
- Total target and balance amounts
- Average progress percentage
- Goal completion rate

## Dependencies

### Core Libraries
- **jsPDF** - PDF generation
- **papaparse** - CSV parsing and generation
- **chart.js** + **react-chartjs-2** - Chart visualization
- **date-fns** - Date formatting utilities

### Installation
```bash
npm install jspdf papaparse chart.js react-chartjs-2 date-fns
```

## Usage

### Basic Integration

```typescript
import { ExportControls } from './components/ExportControls';
import { Goal } from './utils/export';

function MyComponent({ goals }: { goals: Goal[] }) {
  return (
    <div>
      <ExportControls goals={goals} />
    </div>
  );
}
```

### Programmatic Export

```typescript
import { ExportService } from './utils/export';

// Export to CSV
ExportService.exportToCSV(goals, {
  includeCharts: false,
  includeArchived: true
});

// Export to PDF
ExportService.exportToPDF(goals, {
  includeCharts: true,
  includeArchived: false
});

// Get statistics
const stats = ExportService.getExportStats(goals);
console.log(`Total goals: ${stats.totalGoals}`);
```

## Internationalization

All export features support multiple languages through i18next:

### Supported Languages
- English (en)
- Spanish (es) 
- French (fr)
- German (de)

### Translation Keys
- `exportGoals` - Export section title
- `exportToCSV` / `exportToPDF` - Button labels
- `includeArchivedGoals` - Option labels
- `totalGoals`, `activeGoals`, etc. - Statistics labels
- `goalProgressChart` - Chart titles
- `exportFailed`, `noGoalsToExport` - Error messages

## Styling

### CSS Classes
- `.export-controls` - Main container
- `.export-controls__header` - Header section
- `.export-controls__options` - Options panel
- `.export-controls__stats` - Statistics display
- `.export-controls__chart` - Chart container
- `.export-controls__actions` - Action buttons
- `.export-btn` - Export buttons
- `.export-btn--csv` / `.export-btn--pdf` - Button variants

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Flexible grid layouts
- Touch-friendly interface elements

### Dark Mode Support
- Automatic detection via `prefers-color-scheme`
- CSS custom properties for theme colors
- Consistent styling across all components

## Testing

### Test Coverage
- Unit tests for ExportService methods
- Statistics calculation verification
- Chart data generation testing
- Edge case handling (empty arrays, zero targets, large numbers)

### Test Files
- `src/utils/__tests__/export.test.ts` - Core functionality tests

## Error Handling

### Graceful Degradation
- Empty goal arrays handled without errors
- Failed exports show user-friendly error messages
- Network issues don't crash the application

### User Feedback
- Loading states during export operations
- Error alerts for failed exports
- Success confirmations (implicit through download)

## Performance Considerations

### Optimization Strategies
- Efficient data transformation algorithms
- Minimal DOM manipulation
- Lazy loading of chart components
- Debounced chart updates

### Memory Management
- Proper cleanup of chart instances
- URL object revocation after downloads
- Event listener cleanup

## Browser Compatibility

### Supported Features
- File download API
- Canvas rendering for charts
- CSS Grid and Flexbox
- Modern JavaScript (ES2020+)

### Polyfills May Be Needed
- BigInt support for older browsers
- Array methods for legacy browsers
- URL.createObjectURL fallback

## Security Considerations

### Data Privacy
- No external API calls for exports
- All processing done client-side
- No sensitive data logging

### File Security
- Controlled file naming with timestamps
- Safe blob creation for downloads
- XSS prevention in chart labels

## Future Enhancements

### Planned Features
- Excel export (.xlsx format)
- Custom date range filtering
- Advanced chart types
- Email export functionality
- Export scheduling

### Potential Improvements
- Progress tracking for large datasets
- Custom report templates
- Batch export operations
- Export history tracking