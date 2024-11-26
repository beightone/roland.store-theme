// Dependencies
import React, { useState } from 'react'
import classNames from 'classnames'

// Styles
import styles from './styles.css'

// Types
import type { ReactNode } from 'react'

interface CollapsibleContentProps {
  children: ReactNode
}

const CollapsibleContent = ({ children }: CollapsibleContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  const containerClasses = classNames(styles.collapsibleContentContainer, {
    [styles.collapsibleContentContainerOpen]: isCollapsed,
  })

  return (
    <div className={containerClasses}>
      {children}
      <button
        onClick={handleToggle}
        className={styles.collapsibleContentButton}
      >
        {isCollapsed ? 'Ver mais' : 'Ver menos'}
      </button>
    </div>
  )
}

export default CollapsibleContent
