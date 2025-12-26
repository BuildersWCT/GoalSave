import { useTheme } from '../contexts/ThemeContext'
import './ThemeToggle.css'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className={`theme-toggle ${theme === 'dark' ? 'theme-toggle-dark' : 'theme-toggle-light'}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="theme-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
