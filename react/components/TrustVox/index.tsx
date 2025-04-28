import React, { useEffect } from 'react'
import styles from './styles.css'
import './styles.global.css'
import { useProduct } from 'vtex.product-context'
interface TrustVoxStarsProps {
  origin: string
}
const TrustVoxStars = ({ origin }: TrustVoxStarsProps) => {
  const { product } = useProduct() ?? {}

  // @ts-ignore
  window._trustvox_shelf_rate = []
  // @ts-ignore
  window._trustvox_shelf_rate.push(['_storeId', '114129'])

  useEffect(() => {
    const script = document.createElement('script')

    script.src = '//rate.trustvox.com.br/widget.js'
    script.async = true
    document.head.appendChild(script)
  }, [])
  function ajustingWindowPosition() {
    const element = document.getElementById('reviews') as HTMLElement
    if (!element) return
    const deslocationToCentralize = -50

    const quantityToScroll = Number(element.offsetTop) + deslocationToCentralize

    window.scrollTo({
      top: quantityToScroll,
      behavior: 'smooth',
    })
  }

  return (
    <div className={styles.stars_container}>
      {origin === 'product-page' ? (
        <button
          className="trustvox-fluid-jump trustvox-widget-rating"
          onClick={ajustingWindowPosition}
          title="Pergunte e veja opiniões de quem já comprou"
        >
          <div
            className="trustvox-shelf-container"
            data-trustvox-product-code-js={product?.productId}
            data-trustvox-should-skip-filter="true"
            data-trustvox-display-rate-schema="true"
          />
        </button>
      ) : (
        <div
          className="trustvox-shelf-container"
          data-trustvox-product-code-js={product?.productId}
          data-trustvox-should-skip-filter="true"
          data-trustvox-display-rate-schema="true"
        />
      )}
    </div>
  )
}

export default TrustVoxStars
