import React from 'react'

function MenuItem({
  id,
  icon,
  label,
  isSelected,
  onClick,
  isOpen,
  isDesktop,
  iconDelay = 0,
  textDelay = 0,
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
        className={`w-5 flex-shrink-0 ${iconAnimationBase} ${isDesktop ? (isOpen ? iconAnimationExpanded : iconAnimationCollapsed) : ''}`}
        style={{ transitionDelay: isOpen && iconDelay ? `${iconDelay}ms` : '0ms' }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        {icon}
      </svg>
      {(isOpen || !isDesktop) && (
        <span
          className={`${textAnimationBase} ${isDesktop ? (isOpen ? textAnimationExpanded : textAnimationCollapsed) : textAnimationExpanded}`}
          style={{ transitionDelay: isOpen && textDelay ? `${textDelay}ms` : '0ms' }}
        >
          {label}
        </span>
      )}
    </button>
  )
}

export default MenuItem