import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CeloSaveABI } from './CeloSaveABI'

const CONTRACT_ADDRESS = '0xF9Ba5E30218B24C521500Fe880eE8eaAd2897055' as `0x${string}`

interface GoalFormProps {
  onGoalCreated: () => void
}

export function GoalForm({ onGoalCreated }: GoalFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [token, setToken] = useState('0x0000000000000000000000000000000000000000') // CELO
  const [target, setTarget] = useState('')
  const [lockUntil, setLockUntil] = useState('')

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !target) return

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CeloSaveABI,
      functionName: 'createGoal',
      args: [name, token as `0x${string}`, BigInt(target), BigInt(lockUntil || '0')],
    })
  }

  // Reset form when transaction is confirmed
  React.useEffect(() => {
    if (hash && !isConfirming) {
      onGoalCreated()
      setName('')
      setTarget('')
      setLockUntil('')
    }
  }, [hash, isConfirming, onGoalCreated])

  return (
    <div className="goal-form">
      <h3>{t('createGoal')}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('goalNamePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder={t('tokenAddressPlaceholder')}
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <input
          type="number"
          placeholder={t('targetAmountPlaceholder')}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder={t('lockUntilPlaceholder')}
          value={lockUntil}
          onChange={(e) => setLockUntil(e.target.value)}
        />
        <button type="submit" disabled={isPending || isConfirming}>
          {isPending ? t('creating') : isConfirming ? t('waiting') : t('createButton')}
        </button>
      </form>
    </div>
  )
}