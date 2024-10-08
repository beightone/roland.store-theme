/* eslint-disable @typescript-eslint/no-unused-vars */
// Dependencies
import React from 'react'

// Styles
import styles from './styles.css'

// Components
import { SliderLayout } from 'vtex.slider-layout'

// Context
import { CUSTOM_INFOCARD_SCHEMA } from './schema'

// Interface
interface CustomInfoCardProps {
  cards: any
}

const configSlider: any = {
  itemsPerPage: {
    desktop: 4,
    tablet: 3,
    phone: 2,
  },
  infinite: true,
  usePagination: true,
  showNavigationArrows: 'never',
  showPaginationDots: 'always',
}

const CustomInfoCard = ({ cards }: CustomInfoCardProps) => {
  console.log('cards', cards)

  return (
    <div className={styles['cards-container']}>
      <SliderLayout {...configSlider}>
        {cards.map((card: any) => {
          const { image, hoverImage, title, link, buttonLabel } = card

          return (
            <a href={link} key={image}>
              <div className={styles['card-wrapper']}>
                <div className={styles['card-image']}>
                  <img src={image} alt={title} />
                </div>
                <div className={styles['hover-image']}>
                  <img src={hoverImage} alt={title} />
                </div>
                <div className={styles['card-content']}>
                  <h3>{title}</h3>
                  <button>{buttonLabel}</button>
                </div>
              </div>
            </a>
          )
        })}
      </SliderLayout>
    </div>
  )
}

CustomInfoCard.schema = CUSTOM_INFOCARD_SCHEMA

export default CustomInfoCard
