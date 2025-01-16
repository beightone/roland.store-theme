// Dependencies
import React, { useEffect, useState } from 'react'
import { useDevice } from 'vtex.device-detector'

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
  const { isMobile } = useDevice()

  const handleAnchorClick = (anchor: (typeof initialAnchors)[0]) => {
    console.log('here anchor', anchor)

    ajustingWindowPosition(anchor.id)
    setSelectedAnchor(anchor)
    setIsOpen(false)
  }
  function ajustingWindowPosition(itemId: string) {
    console.log('ajustingWindowPosition, here', itemId)
    const element = document.getElementById(itemId) as HTMLElement
    console.log('here element', element)
    if (!element) return
    const deslocationToCentralize = -50
    console.log('here deslocationToCentralize', deslocationToCentralize)

    const quantityToScroll = Number(element.offsetTop) + deslocationToCentralize
    console.log('here quantityToScroll', quantityToScroll)

    window.scrollTo({
      top: quantityToScroll,
      behavior: 'smooth',
    })
  }

  function checkingActiveAnchors() {
    const observers: MutationObserver[] = []
    let timeoutId: any

    const checkAnchors = () => {
      const updatedAnchors = initialAnchors.map((anchor) => ({
        ...anchor,
        showItem: !!document.getElementById(anchor.id),
      }))
      setAnchors(updatedAnchors)
    }

    initialAnchors.forEach((anchor) => {
      const observer = new MutationObserver(() => {
        const element = document.getElementById(anchor.id)
        if (element) {
          checkAnchors()
          observer.disconnect()
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
      observers.push(observer)
    })

    timeoutId = setTimeout(() => {
      observers.forEach((observer) => observer.disconnect())
    }, 30000)

    return () => {
      clearTimeout(timeoutId)
      observers.forEach((observer) => observer.disconnect())
    }
  }

  useEffect(() => {
    checkingActiveAnchors()
  }, [])

  return (
    <div className={styles.anchorSectionsWrapper}>
      {isMobile ? (
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
                  {anchor.label}
                </button>
              ) : null
            )}
          </div>
        </div>
      ) : (
        <div className={styles.desktopView}>
          {anchors.map((anchor) =>
            anchor.showItem ? (
              <button
                key={anchor.id}
                className={styles.anchorButton}
                onClick={() => handleAnchorClick(anchor)}
              >
                {anchor.label}
              </button>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

export default AnchorSections
