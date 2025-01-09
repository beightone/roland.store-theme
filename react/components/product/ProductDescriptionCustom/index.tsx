/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { useProduct } from 'vtex.product-context'

import type { IProductProperties } from '../../../typings/productsInfos'
import styles from './styles.css'
import { getPropertyByName } from '../../../utils/getPropertyByName'
import { formatTextAsHTML } from '../../../utils/formatTextAsHTML'

const ProductDescriptionCustom = () => {
  const context = useProduct()

  if (!context) return null
  const product = context?.product

  const properties = product?.properties as IProductProperties[] | undefined

  if (!properties) return null

  const qualitiesContent: string[] = []

  properties?.forEach((item: IProductProperties) => {
    if (item.name.substring(0, 10) === 'Qualidade ') {
      qualitiesContent.push(item.values[0])
    }
  })
  const descriptionTitle = getPropertyByName(properties, 'Descrição Título')
  const descriptionText = getPropertyByName(properties, 'Descrição Texto')

  return (
    <section className={styles.descriptionContainer} id="description">
      <h2 className={styles.descriptionGeneralTitle}>Informações do produto</h2>
      {qualitiesContent.length > 0 && (
        <ul className={styles.descriptionQualityList}>
          {qualitiesContent?.map((item: any) => (
            <li
              className={styles.descriptionQualityListItem}
              key={item}
              dangerouslySetInnerHTML={{ __html: formatTextAsHTML(item) }}
            />
          ))}
        </ul>
      )}
      {descriptionTitle && descriptionText && (
        <>
          <h3 className={styles.descriptionTitle}>{descriptionTitle}</h3>
          <p
            className={styles.descriptionText}
            dangerouslySetInnerHTML={{
              __html: formatTextAsHTML(descriptionText),
            }}
          />
        </>
      )}
    </section>
  )
}

export default ProductDescriptionCustom
