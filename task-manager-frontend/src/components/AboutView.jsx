import React from 'react'
import { useTranslation } from 'react-i18next'

function AboutView({ isDesktop }) {
  const { t } = useTranslation()
  return (
    <div className="h-full bg-white dark:bg-gray-900">
       {isDesktop && (
         <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{t("menu.about")}</h2>
         </div>
       )}
        <p className="text-lg">{t("about.mainText")}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("about.version")}</p>
    </div>
  )
}

export default AboutView
