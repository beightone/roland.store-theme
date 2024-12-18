// Dependencies
import React, { useState } from 'react'

// Styles
import styles from './styles.css'

const ANCHORS = [
  {
    id: 'description',
    label: 'Informações do produto',
  },
  {
    id: 'specifications',
    label: 'Especificações Técnicas',
  },
  {
    id: 'manual',
    label: 'Manual de Instruções',
  },
  {
    id: 'content',
    label: 'O que está incluso?',
  },
  {
    id: 'video',
    label: 'Vídeo do produto',
  },
  {
    id: 'reviews',
    label: 'Avaliações',
  },
]

const AnchorSections = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAnchor, setSelectedAnchor] = useState(ANCHORS[0])

  const handleAnchorClick = (anchor: (typeof ANCHORS)[0]) => {
    setSelectedAnchor(anchor)
    setIsOpen(false)
  }

  return (
    <div className={styles.anchorSectionsWrapper}>
      <div className={styles.mobileDropdown}>
        <button
          className={styles.dropdownToggle}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedAnchor.label}
        </button>

        <div
          className={`${styles.dropdownContent} ${isOpen ? styles.open : ''}`}
        >
          {ANCHORS.map((anchor) => (
            <button
              key={anchor.id}
              className={styles.anchorButton}
              onClick={() => handleAnchorClick(anchor)}
            >
              <a href={`#${anchor.id}`}>{anchor.label}</a>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.desktopView}>
        {ANCHORS.map((anchor) => (
          <button
            key={anchor.id}
            className={styles.anchorButton}
            onClick={() => setSelectedAnchor(anchor)}
          >
            <a href={`#${anchor.id}`}>{anchor.label}</a>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AnchorSections
