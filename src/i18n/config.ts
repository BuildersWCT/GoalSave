import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      appTitle: 'GoalSave - Goal-Based Savings',

      // Goal Form
      createGoal: 'Create New Goal',
      goalName: 'Goal Name',
      goalNamePlaceholder: 'e.g., Emergency Fund',
      tokenAddress: 'Token Address',
      tokenAddressPlaceholder: 'Token contract address',
      targetAmount: 'Target Amount',
      targetAmountPlaceholder: '1000',
      lockUntil: 'Lock Until Date',
      lockUntilPlaceholder: 'YYYY-MM-DD',
      createButton: 'Create Goal',
      creating: 'Creating...',
      waiting: 'Waiting...',

      // Goal List
      yourGoals: 'Your Goals',
      noGoals: 'No goals yet. Create your first goal!',
      noActiveGoals: 'No active goals.',
      noArchivedGoals: 'No archived goals.',
      loading: 'Loading goals...',
      target: 'Target',
      balance: 'Balance',
      token: 'Token',
      status: 'Status',
      archived: 'Archived',
      
      // Archive functionality
      archive: 'Archive',
      restore: 'Restore',
      archiving: 'Archiving...',
      restoring: 'Restoring...',
      active: 'Active',
      archivedGoals: 'Archived Goals',

      // Footer
      footerText: 'Built with Vite + React + WalletConnect on Celo',

      // Errors
      connectWallet: 'Please connect your wallet first',
      errorCreatingGoal: 'Error creating goal',
      errorLoadingGoals: 'Error loading goals',

      // Theme
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode',

      // Language
      language: 'Language',
      english: 'English',
      spanish: 'Spanish',
      french: 'French',
      german: 'German'
    }
  },
  es: {
    translation: {
      // Header
      appTitle: 'GoalSave - Ahorro por Objetivos',

      // Goal Form
      createGoal: 'Crear Nuevo Objetivo',
      goalName: 'Nombre del Objetivo',
      goalNamePlaceholder: 'ej., Fondo de Emergencia',
      tokenAddress: 'Dirección del Token',
      tokenAddressPlaceholder: 'Dirección del contrato del token',
      targetAmount: 'Cantidad Objetivo',
      targetAmountPlaceholder: '1000',
      lockUntil: 'Bloquear Hasta',
      lockUntilPlaceholder: 'AAAA-MM-DD',
      createButton: 'Crear Objetivo',
      creating: 'Creando...',
      waiting: 'Esperando...',

      // Goal List
      yourGoals: 'Tus Objetivos',
      noGoals: '¡Aún no hay objetivos. Crea tu primer objetivo!',
      noActiveGoals: 'No hay objetivos activos.',
      noArchivedGoals: 'No hay objetivos archivados.',
      loading: 'Cargando objetivos...',
      target: 'Objetivo',
      balance: 'Saldo',
      token: 'Token',
      status: 'Estado',
      archived: 'Archivado',
      
      // Archive functionality
      archive: 'Archivar',
      restore: 'Restaurar',
      archiving: 'Archivando...',
      restoring: 'Restaurando...',
      active: 'Activos',
      archivedGoals: 'Objetivos Archivados',

      // Footer
      footerText: 'Construido con Vite + React + WalletConnect en Celo',

      // Errors
      connectWallet: 'Por favor conecta tu billetera primero',
      errorCreatingGoal: 'Error al crear objetivo',
      errorLoadingGoals: 'Error al cargar objetivos',

      // Theme
      switchToLight: 'Cambiar a modo claro',
      switchToDark: 'Cambiar a modo oscuro',

      // Language
      language: 'Idioma',
      english: 'Inglés',
      spanish: 'Español',
      french: 'Francés',
      german: 'Alemán'
    }
  },
  fr: {
    translation: {
      // Header
      appTitle: 'GoalSave - Épargne par Objectifs',

      // Goal Form
      createGoal: 'Créer un Nouvel Objectif',
      goalName: 'Nom de l\'Objectif',
      goalNamePlaceholder: 'ex., Fonds d\'Urgence',
      tokenAddress: 'Adresse du Token',
      tokenAddressPlaceholder: 'Adresse du contrat du token',
      targetAmount: 'Montant Cible',
      targetAmountPlaceholder: '1000',
      lockUntil: 'Verrouiller Jusqu\'au',
      lockUntilPlaceholder: 'AAAA-MM-JJ',
      createButton: 'Créer l\'Objectif',
      creating: 'Création...',
      waiting: 'En attente...',

      // Goal List
      yourGoals: 'Vos Objectifs',
      noGoals: 'Aucun objectif pour le moment. Créez votre premier objectif!',
      noActiveGoals: 'Aucun objectif actif.',
      noArchivedGoals: 'Aucun objectif archivé.',
      loading: 'Chargement des objectifs...',
      target: 'Cible',
      balance: 'Solde',
      token: 'Token',
      status: 'Statut',
      archived: 'Archivé',
      
      // Archive functionality
      archive: 'Archiver',
      restore: 'Restaurer',
      archiving: 'Archivage...',
      restoring: 'Restauration...',
      active: 'Actifs',
      archivedGoals: 'Objectifs Archivés',

      // Footer
      footerText: 'Construit avec Vite + React + WalletConnect sur Celo',

      // Errors
      connectWallet: 'Veuillez d\'abord connecter votre portefeuille',
      errorCreatingGoal: 'Erreur lors de la création de l\'objectif',
      errorLoadingGoals: 'Erreur lors du chargement des objectifs',

      // Theme
      switchToLight: 'Passer en mode clair',
      switchToDark: 'Passer en mode sombre',

      // Language
      language: 'Langue',
      english: 'Anglais',
      spanish: 'Espagnol',
      french: 'Français',
      german: 'Allemand'
    }
  },
  de: {
    translation: {
      // Header
      appTitle: 'GoalSave - Zielbasiertes Sparen',

      // Goal Form
      createGoal: 'Neues Ziel Erstellen',
      goalName: 'Zielname',
      goalNamePlaceholder: 'z.B., Notfallfonds',
      tokenAddress: 'Token-Adresse',
      tokenAddressPlaceholder: 'Token-Vertragsadresse',
      targetAmount: 'Zielbetrag',
      targetAmountPlaceholder: '1000',
      lockUntil: 'Sperren Bis',
      lockUntilPlaceholder: 'JJJJ-MM-TT',
      createButton: 'Ziel Erstellen',
      creating: 'Erstellen...',
      waiting: 'Warten...',

      // Goal List
      yourGoals: 'Ihre Ziele',
      noGoals: 'Noch keine Ziele. Erstellen Sie Ihr erstes Ziel!',
      noActiveGoals: 'Keine aktiven Ziele.',
      noArchivedGoals: 'Keine archivierten Ziele.',
      loading: 'Ziele laden...',
      target: 'Ziel',
      balance: 'Guthaben',
      token: 'Token',
      status: 'Status',
      archived: 'Archiviert',
      
      // Archive functionality
      archive: 'Archivieren',
      restore: 'Wiederherstellen',
      archiving: 'Archiviere...',
      restoring: 'Stelle wieder her...',
      active: 'Aktiv',
      archivedGoals: 'Archivierte Ziele',

      // Footer
      footerText: 'Erstellt mit Vite + React + WalletConnect auf Celo',

      // Errors
      connectWallet: 'Bitte verbinden Sie zuerst Ihre Wallet',
      errorCreatingGoal: 'Fehler beim Erstellen des Ziels',
      errorLoadingGoals: 'Fehler beim Laden der Ziele',

      // Theme
      switchToLight: 'Zum hellen Modus wechseln',
      switchToDark: 'Zum dunklen Modus wechseln',

      // Language
      language: 'Sprache',
      english: 'Englisch',
      spanish: 'Spanisch',
      french: 'Französisch',
      german: 'Deutsch'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n
