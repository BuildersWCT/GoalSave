import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { celoAlfajores } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { CollaborationProvider } from './contexts/CollaborationContext'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { NotificationBell } from './components/NotificationBell'
import { GoalForm } from './GoalForm'
import { GoalList } from './GoalList'
import './App.css'

// 1. Get projectId at https://cloud.reown.com
const projectId = '2f05a7db73b6e7a4c24c7cb5db29e0a6'

// 2. Create wagmi adapter
const metadata = {
  name: 'GoalSave',
  description: 'Goal-based CELO savings vault',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const networks = [celoAlfajores]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// 3. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  }
})

const queryClient = new QueryClient()

function App() {
  const { t } = useTranslation()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleGoalCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <CollaborationProvider>
          <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <div className="app">
                <header>
                  <h1>{t('appTitle')}</h1>
                  <div className="header-controls">
                    <NotificationBell />
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <appkit-button />
                  </div>
                </header>

                <main>
                  <GoalForm onGoalCreated={handleGoalCreated} />
                  <GoalList key={refreshKey} />
                </main>

                <footer>
                  <p>{t('footerText')}</p>
                </footer>
              </div>
            </QueryClientProvider>
          </WagmiProvider>
        </CollaborationProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
