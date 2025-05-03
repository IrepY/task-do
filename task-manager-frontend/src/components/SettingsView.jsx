import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ThemeToggle = ({ isEnabled, onToggle }) => {
  const { t } = useTranslation()
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        isEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      aria-pressed={isEnabled}
      role="switch"
    >
      <span className="sr-only">{t('settings.toggleDarkMode')}</span>
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function SettingsView({ isDesktop }) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark'
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode])

  return (
    <div className={`flex-col text-gray-700 dark:text-gray-300 dark:bg-gray-900`}>
       {isDesktop && (
          <h2 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">{t('menu.settings')}</h2>
       )}

      <div className="space-y-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('settings.language')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('settings.selectLanguage')}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                i18n.changeLanguage('en')
                localStorage.setItem('language', 'en')
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentLanguage === 'en'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="font-medium">English</span>
              {currentLanguage === 'en' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button
              onClick={() => {
                i18n.changeLanguage('hu')
                localStorage.setItem('language', 'hu')
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentLanguage === 'hu'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="font-medium">Magyar</span>
              {currentLanguage === 'hu' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('settings.theme')}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.darkMode')}</p>
            <ThemeToggle isEnabled={isDarkMode} onToggle={() => setIsDarkMode(prev => !prev)} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default SettingsView
