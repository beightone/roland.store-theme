import type { CSSProperties } from 'react'
import React from 'react'
import classNames from 'classnames'

interface ArrowProps {
  className?: string
  style?: CSSProperties
  onClick?: () => void
  cssClass: string
  customClasses?: string
}

const Arrow: React.FC<ArrowProps> = ({
  className,
  style,
  onClick,
  cssClass,
  customClasses,
}) => {
  const arrowClasses = classNames({
    [`${className}`]: className,
    [`${cssClass}`]: cssClass,
    [`${customClasses}`]: customClasses,
  })


  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={`${arrowClasses}`} style={{ ...style }} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="#52525B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default Arrow
