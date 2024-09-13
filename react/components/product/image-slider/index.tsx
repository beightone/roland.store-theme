/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef } from 'react'

// Styles
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
  const slider1 = useRef<Slider | null>(null)
  const slider2 = useRef<Slider | null>(null)

  console.log("product", product)

  const settingsMainSlider = {
    dots: false,
    infinite: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: styles['main-slider'],
    asNavFor: slider2.current!,
    ref: slider1,
    beforeChange: (_: any, next: any) => setActiveSlideIndex(next),
  }

  const settingsThumbsSlider = {
    asNavFor: slider1.current!,
    ref: slider2,
    slidesToShow: 4,
    vertical: !isMobile,
    swipeToSlide: true,
    className: styles['thumb-slider'],
    focusOnSelect: true,
    nextArrow: <Arrow cssClass={VTEXClasses.ARROW_RIGHT_CLASS} />,
    prevArrow: <Arrow cssClass={VTEXClasses.ARROW_LEFT_CLASS} />,
  }

  const openModal = (index: number) => {
    setActiveSlideIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className={styles['image-slider-wrapper']}>
      <Slider {...settingsMainSlider}>
        {selectedItem?.images?.map((image, index) => (
          <div
            key={image.imageId}
            className={styles['image-wrapper']}
            onClick={() => openModal(index)}
          >
            <img
              src={image.imageUrl}
              alt={image.imageLabel}
              className={styles['image-element']}
            />
          </div>
        ))}
      </Slider>
      <Slider {...settingsThumbsSlider}>
        {selectedItem?.images?.map((image) => (
          <div key={image.imageId} className={`${styles['thumb-wrapper']}`}>
            <img
              src={image.imageUrl}
              alt={image.imageLabel}
              className={`${styles['thumb-element']} thumb-element `}
            />
          </div>
        ))}
      </Slider>

      <ModalZoom
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        images={selectedItem?.images}
        activeSlideIndex={activeSlideIndex}
        closeModal={closeModal}
        VTEXClasses={VTEXClasses}
      />
    </div>
  )
}

export default ImageSlider
