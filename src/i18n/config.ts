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
      loading: 'Loading goals...',
      target: 'Target',
      balance: 'Balance',
      token: 'Token',
      status: 'Status',

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
      german: 'German',
      chinese: 'Chinese',
      japanese: 'Japanese',
      portuguese: 'Portuguese',
      italian: 'Italian',
      russian: 'Russian',

      // Notifications
      notifications: 'Notifications',
      noNotifications: 'No notifications yet',
      unread: 'unread',
      clearAll: 'Clear all',
      removeNotification: 'Remove notification',

      // Collaboration
      makeGoalCollaborative: 'Make Goal Collaborative',
      collaborationDescription: 'Allow multiple users to contribute to this goal and track individual contributions.',
      enableCollaboration: 'Enable Collaboration',
      goalCollaboration: 'Goal Collaboration',
      inviteCollaborator: 'Invite Collaborator',
      collaboratorAddress: 'Collaborator Address',
      inviteMessage: 'Invite Message',
      inviteMessagePlaceholder: 'Add a personal message to your invitation...',
      sending: 'Sending...',
      sendInvite: 'Send Invite',
      optional: 'optional',
      contributorLeaderboard: 'Contributor Leaderboard',
      noContributorsYet: 'No contributors yet',
      totalContributors: 'Total Contributors',
      totalContributions: 'Total Contributions',
      pendingInvites: 'Pending Invites',
      collaborators: 'Collaborators',
      noCollaboratorsYet: 'No collaborators yet',
      contributions: 'Contributions',
      owner: 'Owner',
      contributor: 'Contributor',
      pending: 'Pending',
      accepted: 'Accepted',
      declined: 'Declined',
      expired: 'Expired',
      goals: 'goals'
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
      loading: 'Cargando objetivos...',
      target: 'Objetivo',
      balance: 'Saldo',
      token: 'Token',
      status: 'Estado',

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
      german: 'Alemán',
      chinese: 'Chino',
      japanese: 'Japonés',
      portuguese: 'Portugués',
      italian: 'Italiano',
      russian: 'Ruso',

      // Notifications
      notifications: 'Notificaciones',
      noNotifications: 'Aún no hay notificaciones',
      unread: 'no leído',
      clearAll: 'Limpiar todo',
      removeNotification: 'Eliminar notificación',

      // Collaboration
      makeGoalCollaborative: 'Hacer Objetivo Colaborativo',
      collaborationDescription: 'Permitir que múltiples usuarios contribuyan a este objetivo y rastreen contribuciones individuales.',
      enableCollaboration: 'Habilitar Colaboración',
      goalCollaboration: 'Colaboración de Objetivo',
      inviteCollaborator: 'Invitar Colaborador',
      collaboratorAddress: 'Dirección del Colaborador',
      inviteMessage: 'Mensaje de Invitación',
      inviteMessagePlaceholder: 'Agrega un mensaje personal a tu invitación...',
      sending: 'Enviando...',
      sendInvite: 'Enviar Invitación',
      optional: 'opcional',
      contributorLeaderboard: 'Tabla de Colaboradores',
      noContributorsYet: 'Aún no hay colaboradores',
      totalContributors: 'Total de Colaboradores',
      totalContributions: 'Total de Contribuciones',
      pendingInvites: 'Invitaciones Pendientes',
      collaborators: 'Colaboradores',
      noCollaboratorsYet: 'Aún no hay colaboradores',
      contributions: 'Contribuciones',
      owner: 'Propietario',
      contributor: 'Colaborador',
      pending: 'Pendiente',
      accepted: 'Aceptado',
      declined: 'Rechazado',
      expired: 'Expirado',
      goals: 'objetivos'
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
      loading: 'Chargement des objectifs...',
      target: 'Cible',
      balance: 'Solde',
      token: 'Token',
      status: 'Statut',

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
      german: 'Allemand',
      chinese: 'Chinois',
      japanese: 'Japonais',
      portuguese: 'Portugais',
      italian: 'Italien',
      russian: 'Russe',

      // Notifications
      notifications: 'Notifications',
      noNotifications: 'Pas encore de notifications',
      unread: 'non lu',
      clearAll: 'Tout effacer',
      removeNotification: 'Supprimer la notification',

      // Collaboration
      makeGoalCollaborative: 'Rendre l\'Objectif Collaboratif',
      collaborationDescription: 'Permettre à plusieurs utilisateurs de contribuer à cet objectif et de suivre les contributions individuelles.',
      enableCollaboration: 'Activer la Collaboration',
      goalCollaboration: 'Collaboration d\'Objectif',
      inviteCollaborator: 'Inviter un Collaborateur',
      collaboratorAddress: 'Adresse du Collaborateur',
      inviteMessage: 'Message d\'Invitation',
      inviteMessagePlaceholder: 'Ajoutez un message personnel à votre invitation...',
      sending: 'Envoi...',
      sendInvite: 'Envoyer l\'Invitation',
      optional: 'optionnel',
      contributorLeaderboard: 'Classement des Contributeurs',
      noContributorsYet: 'Pas encore de contributeurs',
      totalContributors: 'Total des Contributeurs',
      totalContributions: 'Total des Contributions',
      pendingInvites: 'Invitations en Attente',
      collaborators: 'Collaborateurs',
      noCollaboratorsYet: 'Pas encore de collaborateurs',
      contributions: 'Contributions',
      owner: 'Propriétaire',
      contributor: 'Contributeur',
      pending: 'En attente',
      accepted: 'Accepté',
      declined: 'Refusé',
      expired: 'Expiré',
      goals: 'objectifs'
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
      loading: 'Ziele laden...',
      target: 'Ziel',
      balance: 'Guthaben',
      token: 'Token',
      status: 'Status',

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
      german: 'Deutsch',
      chinese: 'Chinesisch',
      japanese: 'Japanisch',
      portuguese: 'Portugiesisch',
      italian: 'Italienisch',
      russian: 'Russisch',

      // Notifications
      notifications: 'Benachrichtigungen',
      noNotifications: 'Noch keine Benachrichtigungen',
      unread: 'ungelesen',
      clearAll: 'Alles löschen',
      removeNotification: 'Benachrichtigung entfernen',

      // Collaboration
      makeGoalCollaborative: 'Ziel Kollaborativ Machen',
      collaborationDescription: 'Mehreren Benutzern erlauben, zu diesem Ziel beizutragen und individuelle Beiträge zu verfolgen.',
      enableCollaboration: 'Kollaboration Aktivieren',
      goalCollaboration: 'Ziel-Kollaboration',
      inviteCollaborator: 'Mitarbeiter Einladen',
      collaboratorAddress: 'Mitarbeiter-Adresse',
      inviteMessage: 'Einladungsnachricht',
      inviteMessagePlaceholder: 'Fügen Sie Ihrer Einladung eine persönliche Nachricht hinzu...',
      sending: 'Senden...',
      sendInvite: 'Einladung Senden',
      optional: 'optional',
      contributorLeaderboard: 'Beitrags-Rangliste',
      noContributorsYet: 'Noch keine Beitragenden',
      totalContributors: 'Gesamtanzahl Beitragender',
      totalContributions: 'Gesamtbeiträge',
      pendingInvites: 'Ausstehende Einladungen',
      collaborators: 'Mitarbeiter',
      noCollaboratorsYet: 'Noch keine Mitarbeiter',
      contributions: 'Beiträge',
      owner: 'Eigentümer',
      contributor: 'Beitragender',
      pending: 'Ausstehend',
      accepted: 'Akzeptiert',
      declined: 'Abgelehnt',
      expired: 'Abgelaufen',
      goals: 'Ziele'
    }
  },
  zh: {
    translation: {
      // Header
      appTitle: 'GoalSave - 目标导向储蓄',

      // Goal Form
      createGoal: '创建新目标',
      goalName: '目标名称',
      goalNamePlaceholder: '例如，应急基金',
      tokenAddress: '代币地址',
      tokenAddressPlaceholder: '代币合约地址',
      targetAmount: '目标金额',
      targetAmountPlaceholder: '1000',
      lockUntil: '锁定至日期',
      lockUntilPlaceholder: 'YYYY-MM-DD',
      createButton: '创建目标',
      creating: '创建中...',
      waiting: '等待中...',

      // Goal List
      yourGoals: '您的目标',
      noGoals: '还没有目标。创建您的第一个目标！',
      loading: '加载目标中...',
      target: '目标',
      balance: '余额',
      token: '代币',
      status: '状态',

      // Footer
      footerText: '使用 Vite + React + WalletConnect 在 Celo 上构建',

      // Errors
      connectWallet: '请先连接您的钱包',
      errorCreatingGoal: '创建目标时出错',
      errorLoadingGoals: '加载目标时出错',

      // Theme
      switchToLight: '切换到浅色模式',
      switchToDark: '切换到深色模式',

      // Language
      language: '语言',
      english: '英语',
      spanish: '西班牙语',
      french: '法语',
      german: '德语',
      chinese: '中文',
      japanese: '日语',
      portuguese: '葡萄牙语',
      italian: '意大利语',
      russian: '俄语',

      // Notifications
      notifications: '通知',
      noNotifications: '还没有通知',
      unread: '未读',
      clearAll: '清除全部',
      removeNotification: '删除通知',

      // Collaboration
      makeGoalCollaborative: '使目标协作化',
      collaborationDescription: '允许多个用户为此目标贡献并跟踪个人贡献。',
      enableCollaboration: '启用协作',
      goalCollaboration: '目标协作',
      inviteCollaborator: '邀请协作者',
      collaboratorAddress: '协作者地址',
      inviteMessage: '邀请消息',
      inviteMessagePlaceholder: '为您的邀请添加个人消息...',
      sending: '发送中...',
      sendInvite: '发送邀请',
      optional: '可选',
      contributorLeaderboard: '贡献者排行榜',
      noContributorsYet: '还没有贡献者',
      totalContributors: '总贡献者',
      totalContributions: '总贡献',
      pendingInvites: '待处理邀请',
      collaborators: '协作者',
      noCollaboratorsYet: '还没有协作者',
      contributions: '贡献',
      owner: '所有者',
      contributor: '贡献者',
      pending: '待处理',
      accepted: '已接受',
      declined: '已拒绝',
      expired: '已过期',
      goals: '目标'
    }
  },
  ja: {
    translation: {
      // Header
      appTitle: 'GoalSave - 目標ベースの貯蓄',

      // Goal Form
      createGoal: '新しい目標を作成',
      goalName: '目標名',
      goalNamePlaceholder: '例: 緊急資金',
      tokenAddress: 'トークンアドレス',
      tokenAddressPlaceholder: 'トークン契約アドレス',
      targetAmount: '目標金額',
      targetAmountPlaceholder: '1000',
      lockUntil: 'ロック解除日',
      lockUntilPlaceholder: 'YYYY-MM-DD',
      createButton: '目標を作成',
      creating: '作成中...',
      waiting: '待機中...',

      // Goal List
      yourGoals: 'あなたの目標',
      noGoals: 'まだ目標がありません。最初の目標を作成してください！',
      loading: '目標を読み込み中...',
      target: '目標',
      balance: '残高',
      token: 'トークン',
      status: 'ステータス',

      // Footer
      footerText: 'Vite + React + WalletConnect を使用して Celo 上で構築',

      // Errors
      connectWallet: 'まずウォレットを接続してください',
      errorCreatingGoal: '目標作成エラー',
      errorLoadingGoals: '目標読み込みエラー',

      // Theme
      switchToLight: 'ライトモードに切り替え',
      switchToDark: 'ダークモードに切り替え',

      // Language
      language: '言語',
      english: '英語',
      spanish: 'スペイン語',
      french: 'フランス語',
      german: 'ドイツ語',
      chinese: '中国語',
      japanese: '日本語',
      portuguese: 'ポルトガル語',
      italian: 'イタリア語',
      russian: 'ロシア語',

      // Notifications
      notifications: '通知',
      noNotifications: 'まだ通知がありません',
      unread: '未読',
      clearAll: 'すべてクリア',
      removeNotification: '通知を削除',

      // Collaboration
      makeGoalCollaborative: '目標を協働化',
      collaborationDescription: '複数のユーザーがこの目標に貢献し、個々の貢献を追跡できるようにします。',
      enableCollaboration: '協働を有効化',
      goalCollaboration: '目標協働',
      inviteCollaborator: '協働者を招待',
      collaboratorAddress: '協働者アドレス',
      inviteMessage: '招待メッセージ',
      inviteMessagePlaceholder: '招待に個人的なメッセージを追加...',
      sending: '送信中...',
      sendInvite: '招待を送信',
      optional: 'オプション',
      contributorLeaderboard: '貢献者ランキング',
      noContributorsYet: 'まだ貢献者がいません',
      totalContributors: '総貢献者',
      totalContributions: '総貢献',
      pendingInvites: '保留中の招待',
      collaborators: '協働者',
      noCollaboratorsYet: 'まだ協働者がいません',
      contributions: '貢献',
      owner: '所有者',
      contributor: '貢献者',
      pending: '保留中',
      accepted: '承認済み',
      declined: '拒否済み',
      expired: '期限切れ',
      goals: '目標'
    }
  },
  pt: {
    translation: {
      // Header
      appTitle: 'GoalSave - Poupança Baseada em Metas',

      // Goal Form
      createGoal: 'Criar Nova Meta',
      goalName: 'Nome da Meta',
      goalNamePlaceholder: 'ex., Fundo de Emergência',
      tokenAddress: 'Endereço do Token',
      tokenAddressPlaceholder: 'Endereço do contrato do token',
      targetAmount: 'Valor Alvo',
      targetAmountPlaceholder: '1000',
      lockUntil: 'Bloquear Até',
      lockUntilPlaceholder: 'AAAA-MM-DD',
      createButton: 'Criar Meta',
      creating: 'Criando...',
      waiting: 'Aguardando...',

      // Goal List
      yourGoals: 'Suas Metas',
      noGoals: 'Nenhuma meta ainda. Crie sua primeira meta!',
      loading: 'Carregando metas...',
      target: 'Alvo',
      balance: 'Saldo',
      token: 'Token',
      status: 'Status',

      // Footer
      footerText: 'Construído com Vite + React + WalletConnect no Celo',

      // Errors
      connectWallet: 'Por favor, conecte sua carteira primeiro',
      errorCreatingGoal: 'Erro ao criar meta',
      errorLoadingGoals: 'Erro ao carregar metas',

      // Theme
      switchToLight: 'Mudar para modo claro',
      switchToDark: 'Mudar para modo escuro',

      // Language
      language: 'Idioma',
      english: 'Inglês',
      spanish: 'Espanhol',
      french: 'Francês',
      german: 'Alemão',
      chinese: 'Chinês',
      japanese: 'Japonês',
      portuguese: 'Português',
      italian: 'Italiano',
      russian: 'Russo',

      // Notifications
      notifications: 'Notificações',
      noNotifications: 'Nenhuma notificação ainda',
      unread: 'não lida',
      clearAll: 'Limpar tudo',
      removeNotification: 'Remover notificação',

      // Collaboration
      makeGoalCollaborative: 'Tornar Meta Colaborativa',
      collaborationDescription: 'Permitir que múltiplos usuários contribuam para esta meta e rastreiem contribuições individuais.',
      enableCollaboration: 'Habilitar Colaboração',
      goalCollaboration: 'Colaboração de Meta',
      inviteCollaborator: 'Convidar Colaborador',
      collaboratorAddress: 'Endereço do Colaborador',
      inviteMessage: 'Mensagem de Convite',
      inviteMessagePlaceholder: 'Adicione uma mensagem pessoal ao seu convite...',
      sending: 'Enviando...',
      sendInvite: 'Enviar Convite',
      optional: 'opcional',
      contributorLeaderboard: 'Ranking de Colaboradores',
      noContributorsYet: 'Nenhum colaborador ainda',
      totalContributors: 'Total de Colaboradores',
      totalContributions: 'Total de Contribuições',
      pendingInvites: 'Convites Pendentes',
      collaborators: 'Colaboradores',
      noCollaboratorsYet: 'Nenhum colaborador ainda',
      contributions: 'Contribuições',
      owner: 'Proprietário',
      contributor: 'Colaborador',
      pending: 'Pendente',
      accepted: 'Aceito',
      declined: 'Recusado',
      expired: 'Expirado',
      goals: 'metas'
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
