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

    const intersectionCallback = (entries: any[]) => {
      const floatingBuyBox = document.querySelector(
        '.vtex-sticky-layout-0-x-wrapper--buy-button-fixed'
      ) as HTMLDivElement

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          floatingBuyBox.style.display = 'none'
          floatingBuyBox.style.opacity = '0'
        } else {
          if (isMobile && window.scrollY < 360) {
            return
          }

          floatingBuyBox.style.display = 'block'
          floatingBuyBox.style.opacity = '1'
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
