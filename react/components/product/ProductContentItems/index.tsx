import React from 'react'
import styles from './styles.css'
import { useProduct } from 'vtex.product-context'
import type { IProductProperties } from '../../../typings/productsInfos'
import { formatTextAsHTML } from '../../../utils/formatTextAsHTML'

const ProductContentItems: React.FC = () => {
  const context = useProduct()

  if (!context) return null

  const product = context?.product
  const properties = product?.properties as IProductProperties[] | undefined

  if (!properties) return null

  const productContentList = properties
    .filter((item) => item.name.startsWith('O que está incluso '))
    .map((item) => item.values[0])

  if (productContentList.length === 0) return null

  const formattedProductContentList = productContentList.map((item) =>
    formatTextAsHTML(item)
  )

  return (
    <div className={styles.productContentItemsWrapper}>
      <section className={styles.productContentItemsContainer} id="content">
        <h3 className={styles.productContentItemsTitle}>O que está incluso?</h3>
        <ul className={styles.productContentItemsContent}>
          {formattedProductContentList.map((item, i) => (
            <li
              key={i}
              dangerouslySetInnerHTML={{ __html: item }}
              className={styles.productContentItemsContentItem}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}

export default ProductContentItems
