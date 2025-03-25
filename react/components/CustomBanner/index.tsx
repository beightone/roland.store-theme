import React from 'react'
import styles from './styles.css'
import { useRuntime } from 'vtex.render-runtime'
import { SliderLayout } from 'vtex.slider-layout'
import { BANNER_SCHEMA } from './schema'

interface BannerProps {
  items: ItemProps[]
  infinite: boolean
}

interface ItemProps {
  initialDate?: string
  finalDate?: string
  visible: boolean
  image: string
  imageMobile: string
  itemLink?: string
}

const CustomBanner: StorefrontFunctionComponent<BannerProps> = ({
  items,
  infinite,
}) => {
  const { deviceInfo } = useRuntime()
  const actualDate = Date.now()

  if (!items || items.length === 0) return null

  const configSlider: any = {
    itemsPerPage: {
      desktop: 1,
      tablet: 1,
      phone: 1,
    },
    infinite,
    autoplay: {
      timeout: 5000,
    },
    usePagination: true,
    showNavigationArrows: 'never',
    showPaginationDots: 'always',
  }

  const filteredBanners =
    items?.filter((item) => {
      if (!item.visible) return false

      const initialDate = item.initialDate ? Date.parse(item.initialDate) : null
      const finalDate = item.finalDate ? Date.parse(item.finalDate) : null

      if (initialDate && !finalDate) {
        return actualDate >= initialDate
      }

      if (initialDate && finalDate) {
        return actualDate >= initialDate && actualDate < finalDate
      }

      if (!initialDate && finalDate) {
        return actualDate < finalDate
      }

      return true
    }) ?? []

  return (
    <div className={styles.bannerWrapper}>
      <SliderLayout {...configSlider}>
        {filteredBanners.map((item) => (
          <div className={styles.bannerContent} key={item.image}>
            <a href={item.itemLink ?? '#'}>
              <img
                src={deviceInfo.isMobile ? item.imageMobile : item.image}
                className={styles.bannerImage}
                alt="Banner"
              />
            </a>
          </div>
        ))}
      </SliderLayout>
    </div>
  )
}

CustomBanner.schema = BANNER_SCHEMA

export default CustomBanner
