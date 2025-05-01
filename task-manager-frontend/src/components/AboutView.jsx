import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

function AboutView({ isDesktop }) {
  const { t } = useTranslation()
  return (
    <div className={`p-4 sm:p-6 h-full flex flex-col ${!isDesktop ? 'pb-20' : ''}`}>
       {isDesktop && (
         <div className="mb-6 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-left">{t("menu.about")}</h2>
         </div>
       )}
      <div className="flex-grow text-gray-600 dark:text-gray-300">
        <p className="text-lg">{t("about.mainText")}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("about.version")}</p>
      </div>
    </div>
  )
}

AboutView.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
}

export default AboutView
