import React, { useState } from 'react'
import { useProduct } from 'vtex.product-context'
import styles from './styles.css'

// Interface para a especificação técnica
interface TechnicalSpecification {
  name: string
  text: string
}

const ProductTechnicalSpecifications: React.FC = () => {
  const [showMore, setShowMore] = useState(false)
  const context = useProduct()

  if (!context) return null
  const { product } = context

  if (!product) return null

  const { properties } = product

  const technicalSpecifications: TechnicalSpecification[] =
    properties
      ?.filter(
        (item: any) => item.name.substring(0, 21) === 'Especificação Técnica'
      )
      .map((item: any) => {
        const [name, ...textParts] = item.values[0].split(':')
        const text = textParts.join(':').trim()

        return { name: name.trim() || '', text }
      }) || []

  if (technicalSpecifications.length === 0) return null
  const displayedItems = showMore
    ? technicalSpecifications
    : technicalSpecifications.slice(0, 13)

  return (
    <section className={styles.technicalSpecificationsContainer}>
      <h3 className={styles.technicalSpecificationsTitle}>
        Especificações técnicas
      </h3>
      <ul className={styles.technicalSpecificationsList}>
        {displayedItems.map((item, i) => (
          <li key={`item-${i}`} className={styles.technicalSpecificationsItem}>
            <span className={styles.technicalSpecificationsName}>
              {item.name || ''}
            </span>
            <span className={styles.technicalSpecificationsText}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      {technicalSpecifications.length > 13 && (
        <button
          className={styles.technicalSpecificationsButton}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M5 10L8 7L11 10"
                  stroke="#131324"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Ver Menos
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M5.00024 7L8.00024 10L11.0002 7"
                  stroke="#131324"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Ver Mais
            </>
          )}
        </button>
      )}
    </section>
  )
}

export default ProductTechnicalSpecifications
