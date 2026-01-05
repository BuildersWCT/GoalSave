import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CeloSaveABI } from './CeloSaveABI'
import { useNotifications } from './contexts/NotificationContext'
import { errorLogger } from './utils/errorLogger'

const CONTRACT_ADDRESS = '0xF9Ba5E30218B24C521500Fe880eE8eaAd2897055' as `0x${string}`

interface GoalFormProps {
  onGoalCreated: () => void
}

export function GoalForm({ onGoalCreated }: GoalFormProps) {
  const { t } = useTranslation()
  const { addNotification } = useNotifications()
  const [name, setName] = useState('')
  const [token, setToken] = useState('0x0000000000000000000000000000000000000000') // CELO
  const [target, setTarget] = useState('')
  const [lockUntil, setLockUntil] = useState('')

  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract()

  const { isLoading: isConfirming, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  })

  // Handle write contract errors
  React.useEffect(() => {
    if (writeError) {
      errorLogger.logError(writeError, 'GoalForm.writeContract')
      addNotification({
        type: 'warning',
        title: t('goalCreationFailed'),
        message: writeError.message || t('unknownError'),
      })
    }
  }, [writeError, addNotification, t])

  // Handle transaction confirmation errors
  React.useEffect(() => {
    if (confirmError) {
      errorLogger.logError(confirmError, 'GoalForm.transactionReceipt')
      addNotification({
        type: 'warning',
        title: t('transactionFailed'),
        message: confirmError.message || t('transactionConfirmationError'),
      })
    }
  }, [confirmError, addNotification, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !target) return

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CeloSaveABI,
        functionName: 'createGoal',
        args: [name, token as `0x${string}`, BigInt(target), BigInt(lockUntil || '0')],
      })
    } catch (error) {
      errorLogger.logError(error as Error, 'GoalForm.handleSubmit')
      addNotification({
        type: 'warning',
        title: t('goalCreationFailed'),
        message: error instanceof Error ? error.message : t('unknownError'),
      })
    }
  }

  // Reset form when transaction is confirmed
  React.useEffect(() => {
    if (hash && !isConfirming && !confirmError) {
      onGoalCreated()
      setName('')
      setTarget('')
      setLockUntil('')
    }
  }, [hash, isConfirming, confirmError, onGoalCreated])

  return (
    <div className="goal-form">
      <h3>{t('createGoal')}</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="goal-name">{t('goalName')}</label>
        <input
          id="goal-name"
          type="text"
          placeholder={t('goalNamePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-describedby="goal-name-help"
        />
        <label htmlFor="token-address">{t('tokenAddress')}</label>
        <input
          id="token-address"
          type="text"
          placeholder={t('tokenAddressPlaceholder')}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          aria-describedby="token-address-help"
        />
        <label htmlFor="target-amount">{t('targetAmount')}</label>
        <input
          id="target-amount"
          type="number"
          placeholder={t('targetAmountPlaceholder')}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
          aria-describedby="target-amount-help"
        />
        <label htmlFor="lock-until">{t('lockUntil')}</label>
        <input
          id="lock-until"
          type="number"
          placeholder={t('lockUntilPlaceholder')}
          value={lockUntil}
          onChange={(e) => setLockUntil(e.target.value)}
          aria-describedby="lock-until-help"
        />
        <button type="submit" disabled={isPending || isConfirming} aria-disabled={isPending || isConfirming}>
          {isPending ? t('creating') : isConfirming ? t('waiting') : t('createButton')}
        </button>
      </form>
    </div>
  )
}