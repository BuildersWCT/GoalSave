import { useTranslation } from 'react-i18next'
import './LanguageSwitcher.css'

const languages = [
  { code: 'en', name: 'english', flag: '🇬🇧' },
  { code: 'es', name: 'spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'french', flag: '🇫🇷' },
  { code: 'de', name: 'german', flag: '🇩🇪' },
  { code: 'zh', name: 'chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'japanese', flag: '🇯🇵' },
  { code: 'pt', name: 'portuguese', flag: '🇵🇹' },
  { code: 'it', name: 'italian', flag: '🇮🇹' },
  { code: 'ru', name: 'russian', flag: '🇷🇺' }
]

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
  }

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        aria-label={t('language')}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {t(lang.name)}
          </option>
        ))}
      </select>
    </div>
  )
}
