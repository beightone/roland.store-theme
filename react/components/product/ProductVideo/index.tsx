import React from 'react'
import { useProduct } from 'vtex.product-context'
import { getPropertyByName } from '../../../utils/getPropertyByName'
import type { IProductProperties } from '../../../typings/productsInfos'

import styles from './styles.css'

export const ProductVideo: React.FC = () => {
  const context = useProduct()

  if (!context) return null
  const product = context?.product

  const properties = product?.properties as IProductProperties[] | undefined

  if (!properties) return null
  const videoId = getPropertyByName(properties, 'Vídeo')

  console.log(videoId, 'here videoId')
  if (!videoId) return null

  return (
    <section className={styles.productVideoContainer} id="video">
      <h3 className={styles.productVideoTitle}>
        Veja o vídeo sobre o produto abaixo:
      </h3>
      <div className={styles.productVideoIframeContainer}>
        <iframe
          title="YouTube Video"
          width="100%"
          height="320px"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  )
}

export default ProductVideo
