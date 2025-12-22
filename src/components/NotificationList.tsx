import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNotifications } from '../contexts/NotificationContext'
import { Notification } from '../types/notification'
import './NotificationList.css'

interface NotificationListProps {
  onClose: () => void
}

export function NotificationList({ onClose }: NotificationListProps) {
  const { t } = useTranslation()
  const { notifications, markAsRead, removeNotification, clearAll } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        )
      case 'achievement':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
          </svg>
        )
      case 'reminder':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        )
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        )
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )
    }
  }

  const getNotificationClass = (type: string) => {
    return `notification-item notification-${type}`
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    onClose()
  }

  if (notifications.length === 0) {
    return (
      <div className="notification-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <p>{t('noNotifications')}</p>
      </div>
    )
  }

  return (
    <div className="notification-list">
      <div className="notification-actions">
        <button onClick={clearAll} className="clear-all-btn">
          {t('clearAll')}
        </button>
      </div>
      <div className="notification-items">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${getNotificationClass(notification.type)} ${!notification.read ? 'unread' : ''}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <div className="notification-title">
                {notification.title}
                {!notification.read && <span className="unread-dot" />}
              </div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">
                {new Date(notification.timestamp).toLocaleString()}
              </div>
            </div>
            <button
              className="notification-remove"
              onClick={(e) => {
                e.stopPropagation()
                removeNotification(notification.id)
              }}
              aria-label={t('removeNotification')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}