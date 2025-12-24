interface ErrorLog {
  timestamp: number
  message: string
  stack?: string
  context?: string
  userAgent?: string
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private readonly maxLogs = 100

  logError(error: Error | string, context?: string) {
    const errorMessage = error instanceof Error ? error.message : error
    const stack = error instanceof Error ? error.stack : undefined

    const log: ErrorLog = {
      timestamp: Date.now(),
      message: errorMessage,
      stack,
      context,
      userAgent: navigator.userAgent
    }

    this.logs.push(log)

    // Keep only the latest maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Save to localStorage
    this.saveToStorage()

    // Also log to console
    console.error(`[${context || 'Unknown'}] ${errorMessage}`, { stack, context })
  }

  getLogs(): ErrorLog[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
    localStorage.removeItem('goalsave-error-logs')
  }

  private saveToStorage() {
    try {
      localStorage.setItem('goalsave-error-logs', JSON.stringify(this.logs))
    } catch (e) {
      console.error('Failed to save error logs to localStorage:', e)
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('goalsave-error-logs')
      if (saved) {
        this.logs = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load error logs from localStorage:', e)
    }
  }
}

export const errorLogger = new ErrorLogger()