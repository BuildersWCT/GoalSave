/**
 * Utility functions for deadline calculations and reminders
 */

/**
 * Calculate the number of days until a deadline
 * @param deadlineTimestamp - The deadline timestamp in seconds (bigint)
 * @returns Number of days until deadline (can be negative if past)
 */
export function calculateDaysUntilDeadline(deadlineTimestamp: bigint): number {
  const now = Date.now() / 1000; // Current time in seconds
  const deadline = Number(deadlineTimestamp);
  const diffInSeconds = deadline - now;
  const diffInDays = diffInSeconds / (60 * 60 * 24); // Convert to days
  return Math.floor(diffInDays); // Round down to full days
}

/**
 * Format days until deadline for display
 * @param days - Number of days
 * @returns Formatted string
 */
export function formatDeadlineCountdown(days: number): string {
  if (days < 0) {
    return `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`;
  } else if (days === 0) {
    return 'Due today';
  } else if (days === 1) {
    return 'Due tomorrow';
  } else {
    return `${days} days remaining`;
  }
}

/**
 * Check if a deadline is approaching (within 7 days)
 * @param deadlineTimestamp - The deadline timestamp
 * @returns True if deadline is within 7 days
 */
export function isDeadlineApproaching(deadlineTimestamp: bigint): boolean {
  const days = calculateDaysUntilDeadline(deadlineTimestamp);
  return days >= 0 && days <= 7;
}

/**
 * Check if a deadline is urgent (within 3 days)
 * @param deadlineTimestamp - The deadline timestamp
 * @returns True if deadline is within 3 days
 */
export function isDeadlineUrgent(deadlineTimestamp: bigint): boolean {
  const days = calculateDaysUntilDeadline(deadlineTimestamp);
  return days >= 0 && days <= 3;
}