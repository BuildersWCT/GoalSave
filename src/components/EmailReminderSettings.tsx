import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface EmailReminderSettingsProps {
  goalId: string
  goalName: string
}

interface EmailSettings {
  enabled: boolean
  email: string
  daysBefore: number
}

const STORAGE_KEY_PREFIX = 'email-reminders-'

export function EmailReminderSettings({ goalId, goalName }: EmailReminderSettingsProps) {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<EmailSettings>({
    enabled: false,
    email: '',
    daysBefore: 7,
  })
  const [isSaving, setIsSaving] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + goalId)
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse email reminder settings:', error)
      }
    }
  }, [goalId])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage (in a real app, this would be sent to backend)
      localStorage.setItem(STORAGE_KEY_PREFIX + goalId, JSON.stringify(settings))

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Show success message (could use notification context)
      alert(t('emailReminderSettingsSaved'))
    } catch (error) {
      console.error('Failed to save email reminder settings:', error)
      alert(t('errorSavingSettings'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSettingChange = (key: keyof EmailSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="email-reminder-settings">
      <h4>{t('emailRemindersFor')} "{goalName}"</h4>

      <div className="setting-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => handleSettingChange('enabled', e.target.checked)}
          />
          {t('enableEmailReminders')}
        </label>
      </div>

      {settings.enabled && (
        <>
          <div className="setting-group">
            <label>{t('emailAddress')}:</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange('email', e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="setting-group">
            <label>{t('remindMeDaysBefore')}:</label>
            <select
              value={settings.daysBefore}
              onChange={(e) => handleSettingChange('daysBefore', Number(e.target.value))}
            >
              <option value={1}>1 {t('day')}</option>
              <option value={3}>3 {t('days')}</option>
              <option value={7}>7 {t('days')}</option>
              <option value={14}>14 {t('days')}</option>
              <option value={30}>30 {t('days')}</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !settings.email}
            className="save-button"
          >
            {isSaving ? t('saving') : t('saveSettings')}
          </button>
        </>
      )}
    </div>
  )
}