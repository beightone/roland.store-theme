// Dependencies
import React, { useState } from 'react'
import { useDevice } from 'vtex.device-detector'
import classNames from 'classnames'

// Styles
import styles from './styles.css'

// Types
import type { ReactNode } from 'react'

interface CollapsibleContentProps {
  children: ReactNode
  origin?: string
  shouldCollapsed?: boolean
}

const CollapsibleContent = ({
  children,
  origin,
  shouldCollapsed = true,
}: CollapsibleContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { isMobile } = useDevice()

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  const containerClasses = classNames(
    styles.collapsibleContentContainer,
    {
      [styles.collapsibleContentContainerOpen]: isCollapsed,
    },
    origin === 'collection-seo' && styles['collapsible-content--collection-seo']
  )

  return (
    <div className={containerClasses}>
      {children}
      {shouldCollapsed || isMobile ? (
        <button
          onClick={handleToggle}
          className={styles.collapsibleContentButton}
        >
          {isCollapsed ? 'Ver mais' : 'Ver menos'}
        </button>
      ) : null}
    </div>
  )
}

CollapsibleContent.schema = {
  title: 'Configuração - SEO',
  type: 'object',
  properties: {
    shouldCollapsed: {
      title: 'Exibir Ver mais',
      type: 'boolean',
      description: 'O texto possue mais que 4 linhas?',
    },
  },
}

export default CollapsibleContent
