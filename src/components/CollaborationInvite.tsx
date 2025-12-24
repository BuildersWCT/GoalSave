import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCollaboration } from '../hooks/useCollaboration'
import './CollaborationInvite.css'

interface CollaborationInviteProps {
  goalId: string
  onClose: () => void
}

export function CollaborationInvite({ goalId, onClose }: CollaborationInviteProps) {
  const { t } = useTranslation()
  const { inviteCollaborator } = useCollaboration()
  const [inviteeAddress, setInviteeAddress] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteeAddress.trim()) return

    setIsSubmitting(true)
    try {
      await inviteCollaborator(goalId, inviteeAddress.trim(), message.trim() || undefined)
      setInviteeAddress('')
      setMessage('')
      onClose()
    } catch (error) {
      console.error('Failed to send invite:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="collaboration-invite-overlay">
      <div className="collaboration-invite-modal">
        <div className="collaboration-invite-header">
          <h3>{t('inviteCollaborator')}</h3>
          <button onClick={onClose} className="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="collaboration-invite-form">
          <div className="form-group">
            <label htmlFor="inviteeAddress">{t('collaboratorAddress')}</label>
            <input
              id="inviteeAddress"
              type="text"
              value={inviteeAddress}
              onChange={(e) => setInviteeAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inviteMessage">{t('inviteMessage')} ({t('optional')})</label>
            <textarea
              id="inviteMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('inviteMessagePlaceholder')}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isSubmitting || !inviteeAddress.trim()} className="invite-button">
              {isSubmitting ? t('sending') : t('sendInvite')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}