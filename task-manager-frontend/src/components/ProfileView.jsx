import React from 'react'
import { useTranslation } from 'react-i18next'

function AboutView({ isDesktop }) {
  const { t } = useTranslation()
  
  return (
    <div className="bg-white dark:bg-gray-900 flex-col">
       {isDesktop && (
          <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">{t("menu.profile")}</h2>
       )}
        <p className="text-l text-gray-500 dark:text-gray-400">{t("profile.placeholderText")}</p>
    </div>
  )
}

export default AboutView
