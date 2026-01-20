# Goal Archiving Feature Documentation

## Overview

The Goal Archiving feature allows users to archive completed or abandoned goals without permanently deleting them. This provides better organization and management of user goals while preserving historical data.

## Smart Contract Changes

### New Functions

#### `archiveGoal(uint256 goalId)`
- **Purpose**: Archive a specific goal
- **Parameters**: `goalId` - The ID of the goal to archive
- **Access**: External, whenNotPaused
- **Validation**:
  - Goal must exist
  - Goal must not already be archived
- **Events**: Emits `GoalArchived(address indexed user, uint256 indexed goalId)`
- **Effects**: Sets the `archived` field to `true`

#### `restoreGoal(uint256 goalId)`
- **Purpose**: Restore an archived goal to active state
- **Parameters**: `goalId` - The ID of the goal to restore
- **Access**: External, whenNotPaused
- **Validation**:
  - Goal must exist
  - Goal must be archived
- **Events**: Emits `GoalRestored(address indexed user, uint256 indexed goalId)`
- **Effects**: Sets the `archived` field to `false`

### New Events

- `GoalArchived(address indexed user, uint256 indexed goalId)`
- `GoalRestored(address indexed user, uint256 indexed goalId)`

### New Errors

- `GoalAlreadyArchived()` - Thrown when trying to archive an already archived goal
- `GoalNotArchived()` - Thrown when trying to restore a goal that isn't archived

### Updated Functions

#### Goal Struct
- Added `bool archived` field to track archiving status
- Initialized as `false` when creating new goals

#### Data Validation
The following functions now prevent operations on archived goals:
- `depositNative()` - Prevents deposits to archived goals
- `depositToken()` - Prevents token deposits to archived goals
- `withdraw()` - Prevents withdrawals from archived goals
- `withdrawAll()` - Prevents full withdrawals from archived goals
- `closeGoal()` - Prevents closing archived goals

## Frontend Changes

### GoalList Component Updates
- Added `showArchived` state to toggle between active and archived goals
- Implemented `handleArchiveGoal()` function for archiving goals
- Implemented `handleRestoreGoal()` function for restoring goals
- Added filtering logic to separate active and archived goals
- Added archive/restore buttons with appropriate styling

### UI/UX Improvements
- **View Toggle**: Buttons to switch between "Active" and "Archived" goal views
- **Visual Indicators**: Archived goals display with reduced opacity and dashed borders
- **Action Buttons**: Distinct archive (red) and restore (green) buttons
- **Loading States**: Buttons show "Archiving..." or "Restoring..." during transactions
- **Empty States**: Different messages for no active vs no archived goals

### Styling
- Added CSS classes for archived goal items with visual distinction
- Implemented responsive design for mobile devices
- Added hover effects and disabled states for action buttons

## Internationalization

Added translation strings for all archiving functionality in 4 languages:

### English
```javascript
archive: 'Archive',
restore: 'Restore',
archiving: 'Archiving...',
restoring: 'Restoring...',
noActiveGoals: 'No active goals.',
noArchivedGoals: 'No archived goals.',
archived: 'Archived',
```

### Spanish
```javascript
archive: 'Archivar',
restore: 'Restaurar',
archiving: 'Archivando...',
restoring: 'Restaurando...',
noActiveGoals: 'No hay objetivos activos.',
noArchivedGoals: 'No hay objetivos archivados.',
archived: 'Archivado',
```

### French
```javascript
archive: 'Archiver',
restore: 'Restaurer',
archiving: 'Archivage...',
restoring: 'Restauration...',
noActiveGoals: 'Aucun objectif actif.',
noArchivedGoals: 'Aucun objectif archivé.',
archived: 'Archivé',
```

### German
```javascript
archive: 'Archivieren',
restore: 'Wiederherstellen',
archiving: 'Archiviere...',
restoring: 'Stelle wieder her...',
noActiveGoals: 'Keine aktiven Ziele.',
noArchivedGoals: 'Keine archivierten Ziele.',
archived: 'Archiviert',
```

## Security Considerations

1. **Data Integrity**: Archived goals cannot be modified, ensuring data consistency
2. **Access Control**: Only the goal owner can archive or restore their goals
3. **Validation**: Comprehensive validation prevents invalid operations
4. **Event Logging**: All archiving actions are properly logged for audit trails
5. **Non-Destructive**: Archiving is reversible and preserves all goal data

## Usage Examples

### Archiving a Goal
```javascript
// User wants to archive a completed goal
const goalId = 1; // ID of the goal to archive
await contract.archiveGoal(goalId);
```

### Restoring an Archived Goal
```javascript
// User wants to restore an archived goal
const goalId = 1; // ID of the goal to restore
await contract.restoreGoal(goalId);
```

### Frontend Integration
```javascript
// Handle archive button click
const handleArchive = async (goalId) => {
  setLoading(true);
  try {
    await writeContract({
      address: CONTRACT_ADDRESS,
      abi: CeloSaveABI,
      functionName: 'archiveGoal',
      args: [goalId],
    });
    // UI will update automatically after transaction confirmation
  } catch (error) {
    console.error('Archive failed:', error);
  } finally {
    setLoading(false);
  }
};
```

## Testing Considerations

### Unit Tests
- Test archiving already archived goals (should fail)
- Test restoring non-archived goals (should fail)
- Test archiving non-existent goals (should fail)
- Test operations on archived goals (should fail)

### Integration Tests
- Test complete archive -> restore workflow
- Test UI updates after archiving/restoring
- Test transaction confirmation handling
- Test error handling and user feedback

### Manual Testing
- Test with actual blockchain transactions
- Test UI responsiveness and accessibility
- Test internationalization switching
- Test mobile and desktop views

## Migration Notes

For existing deployments:
1. The `archived` field defaults to `false` for all existing goals
2. No data migration required
3. Frontend gracefully handles goals without archived field (defaults to false)
4. All existing functionality remains unchanged

## Future Enhancements

Potential future improvements:
1. **Bulk Operations**: Archive/restore multiple goals at once
2. **Archive Categories**: Support for multiple archive states
3. **Time-based Archiving**: Automatic archiving based on completion date
4. **Archive Analytics**: Statistics on archived vs active goals
5. **Export Features**: Export archived goals data
6. **Advanced Filtering**: Filter archived goals by date, amount, etc.