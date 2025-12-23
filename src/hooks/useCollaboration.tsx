import { useContext } from 'react'
import { CollaborationContext } from '../contexts/CollaborationContext'

export function useCollaboration() {
  const context = useContext(CollaborationContext)
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider')
  }
  return context
}