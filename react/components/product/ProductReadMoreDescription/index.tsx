import React from 'react'
import { useProduct } from 'vtex.product-context'

import styles from './styles.css'

const ProductReadMoreDescription = () => {
  const context = useProduct()

  if (!context) return null

  const shortDescription = context?.selectedItem?.complementName

  if (!shortDescription) return null

  function ajustingWindowPosition() {
    const element = document.querySelector(
      '.roland-m3-custom-0-x-productDescriptionContent'
    ) as HTMLElement

    if (!element) return
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offset = window.innerHeight / 2

    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    })
  }

  return (
    <section className={styles.productReadMoreDescriptionContainer}>
      <p className={styles.productReadMoreDescriptionText}>
        {shortDescription}
      </p>

      <button
        className={styles.productReadMoreDescriptionButton}
        onClick={() => ajustingWindowPosition()}
      >
        Leia mais
      </button>
    </section>
  )
}

export default ProductReadMoreDescription
