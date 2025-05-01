// Apply dark mode class if needed (before everything else)
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

// Toggle Switch Component
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
  );
};

ThemeToggle.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
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

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
    localStorage.setItem('language', language)
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  }

  return (
    <div className={`p-4 sm:p-6 h-full flex flex-col ${!isDesktop ? 'pb-20' : ''} text-gray-700 dark:text-gray-300`}>
       {isDesktop && (
         <div className="mb-6 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-left">{t('menu.settings')}</h2>
         </div>
       )}

      <div className="flex-grow space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('settings.language')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('settings.selectLanguage')}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                currentLanguage === 'en'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              onClick={() => changeLanguage('hu')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                currentLanguage === 'hu'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('settings.theme')}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.darkMode')}</p>
            <ThemeToggle isEnabled={isDarkMode} onToggle={toggleDarkMode} />
          </div>
        </div>

      </div>
    </div>
  )
}

SettingsView.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
}

export default SettingsView
