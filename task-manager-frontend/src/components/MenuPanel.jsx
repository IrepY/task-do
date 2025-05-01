import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import MenuItem from './MenuItem'

const ICON_PATHS = {
  list: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  ),
  profile: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  ),
  settings: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  ),
  about: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
}

const BASE_DELAYS = { icon: 50, text: 120, step: 50, textStep: 50 }

const AnimatedTitle = ({ title, isVisible }) => {
  const letters = title.split('')
  
  return (
    <span className="inline-block overflow-hidden">
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-300 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible 
              ? 'translateY(0) translateX(0)' 
              : 'translateY(-100%) translateX(10px)',
            transitionDelay: isVisible 
              ? `${index * 50}ms` 
              : `${(letters.length - index - 1) * 40}ms`
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

AnimatedTitle.propTypes = {
  title: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired
}

function MenuPanel({
  isOpen,
  selectedItem,
  onClose,
  onSelectItem,
  isDesktop,
}) {
  const { t } = useTranslation()
  
  const [showTitleAnimation, setShowTitleAnimation] = useState(false)
  const [wasOpen, setWasOpen] = useState(false)

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => setShowTitleAnimation(true), 150); 
      setWasOpen(true);
    } else {
      setShowTitleAnimation(false);
      if (wasOpen) {
        timer = setTimeout(() => setWasOpen(false), 300); 
      }
    }
    return () => clearTimeout(timer);
  }, [isOpen, wasOpen]);

  const transitionBase = {
    common: "transition-all ease-in-out", 
    duration: "duration-300",
  }

  const panelBaseTransition = `${transitionBase.common} ${transitionBase.duration}`
  
  const itemTransition = "transition-all duration-200 ease-out"
  const animations = {
    text: {
      base: `${itemTransition} whitespace-nowrap`, 
      collapsed: "opacity-0 scale-90 translate-y-4", 
      expanded: "opacity-100 scale-100 translate-y-0", 
    },
    icon: {
      base: `${itemTransition}`, 
      collapsed: "hover:scale-125",
      expanded: "scale-100",
    },
  }

  const layout = {
    common: "bg-indigo-600 dark:bg-indigo-800 text-white dark:text-indigo-100 flex flex-col overflow-hidden p-6 sm:p-8",
    desktop: {
      base: "h-full flex-shrink-0 relative overflow-hidden",
      width: isOpen ? 'w-64' : 'w-20',
      transition: `${panelBaseTransition} width`, 
    },
    mobile: {
      base: `absolute inset-y-0 left-0 w-full z-30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`,
      transition: `${panelBaseTransition} transform`, 
    },
    header: "h-[52px]",
  }

  const panelClasses = isDesktop
    ? `${layout.common} ${layout.desktop.base} ${layout.desktop.width} ${layout.desktop.transition}`
    : `${layout.common} ${layout.mobile.base} ${layout.mobile.transition}`

  const itemLayoutClass = isDesktop && !isOpen
    ? 'px-0 justify-center'
    : 'px-6 gap-3'

  const baseItemClass = `text-indigo-100 dark:text-indigo-300 hover:text-white dark:hover:text-indigo-100 text-lg w-full rounded transition duration-150 ease-in-out flex items-center`;

  const getActiveItemClasses = (isActive) => {
    if (!isActive) return ''
    
    return isDesktop && !isOpen
      ? 'relative z-10 after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-indigo-700 dark:after:bg-indigo-900 after:rounded-lg after:w-12 after:h-12 after:-z-10'
      : "bg-indigo-700 dark:bg-indigo-900 text-white dark:text-indigo-100";
  }

  const menuItems = useMemo(() => {
    const ids = ['list', 'profile', 'settings', 'about']
    return ids.map((id, idx) => ({
      id,
      icon: ICON_PATHS[id],
      label: t(`menu.${id === 'list' ? 'tasks' : id}`),
      iconDelay: BASE_DELAYS.icon + idx * BASE_DELAYS.step,
      textDelay: BASE_DELAYS.text + idx * BASE_DELAYS.textStep,
    }))
  }, [t])

  const shouldRenderFullHeader = isOpen || !isDesktop || wasOpen;

  return (
    <div className={panelClasses}>
      <div className={`flex justify-between items-center mb-8 flex-shrink-0 ${layout.header}`}>
        {shouldRenderFullHeader ? (
          <>
            <div className="w-48 overflow-hidden">
              <h2 className="text-2xl font-bold whitespace-nowrap">
                {isDesktop ? (
                  <AnimatedTitle 
                    title="Task-Do" 
                    isVisible={showTitleAnimation} 
                  />
                ) : t('menu.menuTitle')}
              </h2>
            </div>
            {!isDesktop && (
              <button
                onClick={onClose}
                className="text-indigo-100 dark:text-indigo-300 hover:text-white dark:hover:text-indigo-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-indigo-400"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </>
        ) : ( null )
        }
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index === 1 && <hr className="border-indigo-500 dark:border-indigo-700 my-2" />}
            <MenuItem
              id={item.id}
              icon={item.icon}
              label={item.label}
              isSelected={selectedItem === item.id}
              onClick={onSelectItem}
              isOpen={isOpen}
              isDesktop={isDesktop}
              iconDelay={item.iconDelay}
              textDelay={item.textDelay}
              baseItemClass={baseItemClass}
              itemLayoutClass={itemLayoutClass}
              getActiveItemClasses={getActiveItemClasses}
              iconAnimationBase={animations.icon.base}
              iconAnimationCollapsed={animations.icon.collapsed}
              iconAnimationExpanded={animations.icon.expanded}
              textAnimationBase={animations.text.base}
              textAnimationCollapsed={animations.text.collapsed}
              textAnimationExpanded={animations.text.expanded}
            />
          </React.Fragment>
        ))}
      </nav>
    </div>
  )
}

MenuPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedItem: PropTypes.string,
  onSelectItem: PropTypes.func.isRequired,
  isDesktop: PropTypes.bool.isRequired,
}

export default MenuPanel
