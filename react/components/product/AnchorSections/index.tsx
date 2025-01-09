// Dependencies
import React, { useLayoutEffect, useState } from 'react'

// Styles
import styles from './styles.css'

const initialAnchors = [
  {
    id: 'description',
    label: 'Informações do produto',
    showItem: false,
  },
  {
    id: 'specifications',
    label: 'Especificações Técnicas',
    showItem: false,
  },
  {
    id: 'manual',
    label: 'Manual de Instruções',
    showItem: false,
  },
  {
    id: 'content',
    label: 'O que está incluso?',
    showItem: false,
  },
  {
    id: 'video',
    label: 'Vídeo do produto',
    showItem: false,
  },
  {
    id: 'reviews',
    label: 'Avaliações',
    showItem: false,
  },
]

const AnchorSections = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAnchor, setSelectedAnchor] = useState(initialAnchors[0])
  const [anchors, setAnchors] = useState(initialAnchors)

  const handleAnchorClick = (anchor: (typeof initialAnchors)[0]) => {
    setSelectedAnchor(anchor)
    setIsOpen(false)
  }

  useLayoutEffect(() => {
    const updatedAnchors = initialAnchors.map((anchor) => {
      const element = document.getElementById(anchor.id)

      return {
        ...anchor,
        showItem: !!element,
      }
    })

    setAnchors(updatedAnchors)
  }, [])

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
          {anchors.map((anchor) =>
            anchor.showItem ? (
              <button
                key={anchor.id}
                className={styles.anchorButton}
                onClick={() => handleAnchorClick(anchor)}
              >
                <a href={`#${anchor.id}`}>{anchor.label}</a>
              </button>
            ) : null
          )}
        </div>
      </div>

      <div className={styles.desktopView}>
        {anchors.map((anchor) =>
          anchor.showItem ? (
            <button
              key={anchor.id}
              className={styles.anchorButton}
              onClick={() => setSelectedAnchor(anchor)}
            >
              <a href={`#${anchor.id}`}>{anchor.label}</a>
            </button>
          ) : null
        )}
      </div>
    </div>
  )
}

export default AnchorSections
