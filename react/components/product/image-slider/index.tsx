/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'

// Styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './styles.css'
import './global.css'

// Components
import Slider from 'react-slick'
import Arrow from './components/Arrow'

// Hooks
import { useProduct } from 'vtex.product-context'
import { useDevice } from 'vtex.device-detector'
import ModalZoom from './components/ModalZoom'

const VTEXClasses = {
  ARROW_RIGHT_CLASS: `${styles['arrow-right']}`,
  ARROW_LEFT_CLASS: `${styles['arrow-left']}`,
}

const ImageSlider = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const { selectedItem, product } = useProduct() ?? {}
  const { isMobile } = useDevice()

  console.log('product', product)

  if (!selectedItem || !selectedItem.images?.length) {
    return null
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const settingsThumbsSlider = {
    slidesToShow: 4,
    vertical: !isMobile,
    swipeToSlide: true,
    className: styles['thumb-slider'],
    focusOnSelect: true,
    nextArrow: <Arrow cssClass={VTEXClasses.ARROW_RIGHT_CLASS} />,
    prevArrow: <Arrow cssClass={VTEXClasses.ARROW_LEFT_CLASS} />,
    beforeChange: (_: any, next: number) => setActiveSlideIndex(next),
  }

  const isBoss = (product?.brandId as unknown as number) === 2000004

  return (
    <div
      className={`${styles['image-slider-wrapper']} ${
        isBoss ? styles.boss : ''
      }`}
    >
      <div
        className={styles['image-wrapper']}
        style={{ width: '100%' }}
        onClick={openModal}
      >
        <img
          src={selectedItem.images[activeSlideIndex]?.imageUrl}
          alt={selectedItem.images[activeSlideIndex]?.imageLabel}
          width="100%"
          loading="lazy"
          className={styles['image-element']}
        />
      </div>

      <Slider {...settingsThumbsSlider}>
        {selectedItem.images.map((image, index) => (
          <div
            key={image.imageId}
            className={`${styles['thumb-wrapper']} ${
              activeSlideIndex === index ? styles['active-thumb'] : ''
            }`}
            onClick={() => setActiveSlideIndex(index)}
          >
            <img
              src={image.imageUrl}
              alt={image.imageLabel}
              className={`${styles['thumb-element']} thumb-element`}
            />
          </div>
        ))}
      </Slider>

      <ModalZoom
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        images={selectedItem.images}
        activeSlideIndex={activeSlideIndex}
        closeModal={closeModal}
        VTEXClasses={VTEXClasses}
        isBoss={isBoss}
      />
    </div>
  )
}

export default ImageSlider
