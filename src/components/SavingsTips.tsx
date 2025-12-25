import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SavingsTip } from '../types/savingsTips'
import { generateSavingsTips } from '../utils/savingsTipsGenerator'
import './SavingsTips.css'

interface Goal {
  id: bigint
  name: string
  token: string
  target: bigint
  balance: bigint
  createdAt: bigint
  lockUntil: bigint
  closed: boolean
}

interface SavingsTipsProps {
  goals: Goal[] | undefined
  isLoading: boolean
}

export function SavingsTips({ goals, isLoading }: SavingsTipsProps) {
  const { t } = useTranslation()
  const [visibleTips, setVisibleTips] = useState<SavingsTip[]>([])

  useEffect(() => {
    if (!isLoading && goals !== undefined) {
      const result = generateSavingsTips(goals)
      setVisibleTips(result.tips.filter(tip => !tip.dismissed))
    }
  }, [goals, isLoading])

  const handleDismiss = (tipId: string) => {
    setVisibleTips(prev => prev.filter(tip => tip.id !== tipId))
  }

  const handleSave = (tipId: string) => {
    setVisibleTips(prev => prev.map(tip =>
      tip.id === tipId ? { ...tip, saved: true } : tip
    ))
    // Optionally, you could persist saved tips to localStorage or backend
  }

  if (isLoading) {
    return <div className="savings-tips"><p>{t('loading')}</p></div>
  }

  if (visibleTips.length === 0) {
    return null // Don't show if no tips
  }

  return (
    <div className="savings-tips">
      <h3>{t('savingsTips')}</h3>
      {visibleTips.map(tip => (
        <div key={tip.id} className={`tip-item tip-${tip.priority}`}>
          <div className="tip-content">
            <h4>{tip.title}</h4>
            <p>{tip.description}</p>
            <span className="tip-category">{tip.category}</span>
          </div>
          <div className="tip-actions">
            <button
              className="btn-save"
              onClick={() => handleSave(tip.id)}
              disabled={tip.saved}
            >
              {tip.saved ? t('saved') : t('save')}
            </button>
            <button
              className="btn-dismiss"
              onClick={() => handleDismiss(tip.id)}
            >
              {t('dismiss')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}