/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-undef */
import React, { useEffect } from 'react'
import styles from './styles.css'
import { useProduct } from 'vtex.product-context'

const ProductTrustvoxAvaliations: React.FC = () => {
  const product = useProduct()

  ;(window as any)._trustvox = []
  ;(window as any)._trustvox.push(['_storeId', '114129'])
  ;(window as any)._trustvox.push(['_productId', product?.product?.productId])
  ;(window as any)._trustvox.push([
    '_productName',
    product?.product?.productName,
  ])

  useEffect(() => {
    const script = document.createElement('script')

    script.src = '//static.trustvox.com.br/sincero/sincero.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <>
      <div className={styles.avaliationsContainer} id="reviews">
        <h3 className={styles.avaliationsTitle}>
          Pergunte e veja a opinião de quem comprou
        </h3>
        <div className={styles.avaliationsFullContainer}>
          <div className={styles.avaliationsContent}>
            <div className={`${styles.review} ${styles.reviewActive}`}>
              <span>Avaliação</span>
            </div>
          </div>

          <div className={styles.avaliation_container}>
            <div id="_trustvox_widget" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductTrustvoxAvaliations
