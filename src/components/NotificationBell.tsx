import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotifications } from '../contexts/NotificationContext'
import { NotificationList } from './NotificationList'
import './NotificationBell.css'

/**
 * NotificationBell Component
 * 
 * A bell icon with badge that shows unread notification count
 * and dropdown with notification list when clicked
 */
export function NotificationBell() {
  const { t } = useTranslation()
  const { unreadCount } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
  }

  return (
    <div className="notification-bell-container">
      <button
        className={`notification-bell ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={toggleDropdown}
        aria-label={t('notifications')}
        aria-expanded={isOpen}
        title={t('notifications')}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown" onKeyDown={handleKeyDown}>
          <div className="notification-header">
            <h4>{t('notifications')}</h4>
            {unreadCount > 0 && (
              <span className="unread-count">
                {unreadCount} {t('unread')}
              </span>
            )}
          </div>
          <NotificationList onClose={() => setIsOpen(false)} />
        </div>
      )}

      {isOpen && (
        <div
          className="notification-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}