import React from 'react'
import PropTypes from 'prop-types'

function MenuItem({
  id,
  icon,
  label,
  isSelected,
  onClick,
  isOpen,
  isDesktop,
  iconDelay,
  textDelay,
  baseItemClass,
  itemLayoutClass,
  getActiveItemClasses,
  iconAnimationBase,
  iconAnimationCollapsed,
  iconAnimationExpanded,
  textAnimationBase,
  textAnimationCollapsed,
  textAnimationExpanded,
}) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`${baseItemClass} ${itemLayoutClass} h-10 ${getActiveItemClasses(isSelected)}`}
      title={!isOpen && isDesktop ? label : undefined}
    >
      <svg 
        className={`h-5 w-5 flex-shrink-0 ${iconAnimationBase} ${isDesktop ? (isOpen ? iconAnimationExpanded : iconAnimationCollapsed) : ''}`}
        style={{ transitionDelay: isOpen ? `${iconDelay}ms` : '0ms' }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        {icon}
      </svg>
      {(isOpen || !isDesktop) && (
        <span 
          className={`${textAnimationBase} ${isDesktop ? (isOpen ? textAnimationExpanded : textAnimationCollapsed) : textAnimationExpanded}`}
          style={{ transitionDelay: isOpen ? `${textDelay}ms` : '0ms' }}
        >
          {label}
        </span>
      )}
    </button>
  )
}

MenuItem.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
  iconDelay: PropTypes.number.isRequired,
  textDelay: PropTypes.number.isRequired,
  baseItemClass: PropTypes.string.isRequired,
  itemLayoutClass: PropTypes.string.isRequired,
  getActiveItemClasses: PropTypes.func.isRequired,
  iconAnimationBase: PropTypes.string.isRequired,
  iconAnimationCollapsed: PropTypes.string.isRequired,
  iconAnimationExpanded: PropTypes.string.isRequired,
  textAnimationBase: PropTypes.string.isRequired,
  textAnimationCollapsed: PropTypes.string.isRequired,
  textAnimationExpanded: PropTypes.string.isRequired,
}

export default MenuItem