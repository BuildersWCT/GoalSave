import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCollaboration } from '../hooks/useCollaboration'
import { CurrencyDisplay } from './CurrencyDisplay'
import './ContributorLeaderboard.css'

interface ContributorLeaderboardProps {
  onClose: () => void
}

export function ContributorLeaderboard({ onClose }: ContributorLeaderboardProps) {
  const { t } = useTranslation()
  const { leaderboard, updateLeaderboard } = useCollaboration()

  useEffect(() => {
    updateLeaderboard()
  }, [updateLeaderboard])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h3>{t('contributorLeaderboard')}</h3>
          <button onClick={onClose} className="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="leaderboard-content">
          {leaderboard.length === 0 ? (
            <div className="empty-leaderboard">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M16 4h.01" />
                <path d="M16 20h.01" />
                <path d="M8 4h.01" />
                <path d="M8 20h.01" />
                <path d="M12 4h.01" />
                <path d="M12 20h.01" />
                <path d="M4 8h.01" />
                <path d="M4 12h.01" />
                <path d="M4 16h.01" />
                <path d="M20 8h.01" />
                <path d="M20 12h.01" />
                <path d="M20 16h.01" />
              </svg>
              <p>{t('noContributorsYet')}</p>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((contributor, index) => (
                <div key={contributor.address} className={`leaderboard-item ${index < 3 ? 'top-contributor' : ''}`}>
                  <div className="rank-section">
                    <span className="rank">{getRankIcon(contributor.rank)}</span>
                  </div>

                  <div className="contributor-info">
                    <div className="contributor-avatar">
                      {contributor.avatar ? (
                        <img src={contributor.avatar} alt={contributor.name || formatAddress(contributor.address)} />
                      ) : (
                        <div className="default-avatar">
                          {(contributor.name || contributor.address).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="contributor-details">
                      <div className="contributor-name">
                        {contributor.name || formatAddress(contributor.address)}
                      </div>
                      <div className="contributor-address">
                        {formatAddress(contributor.address)}
                      </div>
                    </div>
                  </div>

                  <div className="contribution-stats">
                    <div className="total-contributed">
                      <CurrencyDisplay
                        amount={Number(contributor.totalContributed) / 1e18}
                        originalCurrency="CELO"
                        className="contribution-amount"
                      />
                    </div>
                    <div className="goals-count">
                      {contributor.goalsContributed} {t('goals')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}