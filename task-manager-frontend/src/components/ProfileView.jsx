import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

function ProfileView({ isDesktop }) {
  const { t } = useTranslation()
  return (
    <div className={`p-4 sm:p-6 h-full flex flex-col ${!isDesktop ? 'pb-20' : ''} ${isDesktop ? 'pl-2 sm:pl-4' : ''}`}>
      {isDesktop && (
        <div className="mb-6 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-left">{t('menu.profile')}</h2>
        </div>
      )}
      <div className="flex-grow text-gray-500 dark:text-gray-400">
        <p>{t('profile.placeholderText')}</p>
      </div>
    </div>
  )
}

ProfileView.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
}

export default ProfileView
