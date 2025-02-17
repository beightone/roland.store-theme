import { useLayoutEffect } from 'react'
import { useDevice } from 'vtex.device-detector'

const FloatingAppearanceController = () => {
  const { isMobile } = useDevice()

  useLayoutEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }

    const floatingBuyBox = document.querySelector(
      '.vtex-sticky-layout-0-x-wrapper--buy-button-fixed'
    ) as HTMLDivElement

    if (floatingBuyBox) {
      floatingBuyBox.style.transition = 'opacity 0.3s ease-in-out'
    }

    const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!floatingBuyBox) return

        if (entry.isIntersecting) {
          floatingBuyBox.style.opacity = '0'
          setTimeout(() => {
            floatingBuyBox.style.display = 'none'
          }, 300)
        } else {
          if (isMobile && window.scrollY < 360) {
            return
          }

          floatingBuyBox.style.display = 'block'
          setTimeout(() => {
            floatingBuyBox.style.opacity = '1'
          }, 50)
        }
      })
    }

    const observer = new IntersectionObserver(intersectionCallback, options)

    const buyButtonContainerElement: Element = document.querySelector(
      '.vtex-flex-layout-0-x-flexRow--product-buy-button'
    ) as HTMLDivElement

    if (buyButtonContainerElement) {
      observer.observe(buyButtonContainerElement)
    }

    return () => {
      if (buyButtonContainerElement) {
        observer.unobserve(buyButtonContainerElement)
      }
    }
  }, [])

  return null
}

export default FloatingAppearanceController
