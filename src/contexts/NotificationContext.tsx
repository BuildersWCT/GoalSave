import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Notification, NotificationSettings } from '../types/notification'

interface NotificationContextType {
  notifications: Notification[]
  settings: NotificationSettings
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  updateSettings: (settings: Partial<NotificationSettings>) => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const defaultSettings: NotificationSettings = {
  milestones: [
    { percentage: 25, enabled: true },
    { percentage: 50, enabled: true },
    { percentage: 75, enabled: true },
    { percentage: 100, enabled: true }
  ],
  reminders: {
    enabled: true,
    frequency: 'weekly',
    time: '09:00'
  },
  achievements: {
    enabled: true,
    types: ['first_goal', 'goal_completed', 'streak']
  },
  browser: {
    enabled: false,
    permission: 'default'
  }
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NotificationSettings> }
  | { type: 'LOAD_NOTIFICATIONS'; payload: Notification[] }

const notificationReducer = (state: { notifications: Notification[], settings: NotificationSettings }, action: NotificationAction) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50) // Keep only latest 50
      }
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: []
      }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    case 'LOAD_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload
      }
    default:
      return state
  }
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    settings: defaultSettings
  })

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('goalsave-notifications')
    const savedSettings = localStorage.getItem('goalsave-notification-settings')
    
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications)
        dispatch({ type: 'LOAD_NOTIFICATIONS', payload: notifications })
      } catch (error) {
        console.error('Failed to load notifications from localStorage:', error)
      }
    }
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
      } catch (error) {
        console.error('Failed to load notification settings from localStorage:', error)
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('goalsave-notifications', JSON.stringify(state.notifications))
  }, [state.notifications])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('goalsave-notification-settings', JSON.stringify(state.settings))
  }, [state.settings])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    }
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification })
    
    // Show browser notification if enabled and permission granted
    if (state.settings.browser.enabled && state.settings.browser.permission === 'granted') {
      showBrowserNotification(newNotification)
    }
  }

  const showBrowserNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: notification.id
      })

      browserNotification.onclick = () => {
        window.focus()
        markAsRead(notification.id)
        browserNotification.close()
      }

      // Auto-close after 5 seconds
      setTimeout(() => {
        browserNotification.close()
      }, 5000)
    }
  }

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id })
  }

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' })
  }

  const updateSettings = (settings: Partial<NotificationSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
  }

  const unreadCount = state.notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        settings: state.settings,
        addNotification,
        markAsRead,
        removeNotification,
        clearAll,
        updateSettings,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}