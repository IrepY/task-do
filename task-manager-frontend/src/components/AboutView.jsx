import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

function AboutView({ isDesktop }) {
  const { t } = useTranslation()
  return (
    <div className={`flex-col`}>
       {isDesktop && (
         <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{t("menu.about")}</h2>
         </div>
       )}
      <div className="text-gray-600 dark:text-gray-200">
        <p className="text-lg">{t("about.mainText")}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("about.version")}</p>
      </div>
    </div>
  )
}

export default AboutView
