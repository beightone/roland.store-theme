import React, { useState, useRef, useMemo } from 'react'
import Modal from 'react-modal'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

// Styles
import styles from './styles.css'
import './global.css'

// Components
import Slider from 'react-slick'
import Arrow from './components/Arrow'

// Hooks
import { useProduct } from 'vtex.product-context'
import { useDevice } from 'vtex.device-detector'

const VTEXClasses = {
  ARROW_RIGHT_CLASS: `${styles['arrow-right']}`,
  ARROW_LEFT_CLASS: `${styles['arrow-left']}`,
}

const ImageSlider = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const { selectedItem } = useProduct() ?? {}
  const { isMobile } = useDevice()
  const modalSliderRef = useRef<Slider | null>(null)
  const slider1 = useRef<Slider | null>(null)
  const slider2 = useRef<Slider | null>(null)

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
    vertical: true,
    swipeToSlide: true,
    className: styles['thumb-slider'],
    focusOnSelect: true,
    nextArrow: <Arrow cssClass={VTEXClasses.ARROW_RIGHT_CLASS} />,
    prevArrow: <Arrow cssClass={VTEXClasses.ARROW_LEFT_CLASS} />,
  }

  const modalSliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    fade: true,
    speed: 500,
    slidesToScroll: 1,
    waitForAnimate: false,
    className: styles['modal-slider'],
    initialSlide: activeSlideIndex,
    nextArrow: <Arrow cssClass={VTEXClasses.ARROW_RIGHT_CLASS} />,
    prevArrow: <Arrow cssClass={VTEXClasses.ARROW_LEFT_CLASS} />,
  }

  const filterImages = useMemo(
    () =>
      selectedItem?.images.filter((image: any) =>
        image.imageUrl?.includes(isMobile ? 'mobile' : 'desktop')
      ),
    [selectedItem, isMobile]
  )

  const openModal = (index: number) => {
    setActiveSlideIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleNext = () => {
    modalSliderRef.current?.slickNext()
  }

  const handlePrev = () => {
    modalSliderRef.current?.slickPrev()
  }

  return (
    <div className={styles['image-slider-wrapper']}>
      <Slider {...settingsMainSlider}>
        {selectedItem?.images.map((image, index) => (
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
        {selectedItem?.images.map((image) => (
          <div key={image.imageId} className={`${styles['thumb-wrapper']}`}>
            <img
              src={image.imageUrl}
              alt={image.imageLabel}
              className={`${styles['thumb-element']} thumb-element `}
            />
          </div>
        ))}
      </Slider>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Imagem Ampliada"
        className={styles['modal-zoom-image']}
        overlayClassName={styles['modal-overlay']}
      >
        <div className={styles['modal-content']}>
          <button className={styles['modal-close']} onClick={closeModal}>
            <div className={styles['close-icon']}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M17 7L7 17M7 7L17 17"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          <Slider {...modalSliderSettings} ref={modalSliderRef}>
            {filterImages?.map((image) => (
              <div key={image.imageId} className={styles['modal-slide']}>
                <TransformWrapper>
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <div className={styles['modal-navigation']}>
                        <button
                          onClick={handlePrev}
                          className={styles['modal-prev']}
                        >
                          <Arrow cssClass={VTEXClasses.ARROW_LEFT_CLASS} />
                        </button>

                        <button
                          className={styles['zoom-in']}
                          onClick={(
                            _event: React.MouseEvent<HTMLButtonElement>
                          ) => zoomIn()}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.071 11.9706L4.92899 12.0294M11.9706 4.92899L12.0294 19.071"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          className={styles['zoom-out']}
                          onClick={(
                            _event: React.MouseEvent<HTMLButtonElement>
                          ) => zoomOut()}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.071 11.9706L4.92899 12.0294"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          className={styles['reset-transform']}
                          onClick={(
                            _event: React.MouseEvent<HTMLButtonElement>
                          ) => resetTransform()}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="black"
                            stroke="black"
                            strokeWidth="1.5"
                          >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <g
                                fill="none"
                                fillRule="evenodd"
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                transform="matrix(0 1 1 0 2.5 2.5)"
                              >
                                <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path>{' '}
                                <path
                                  d="m4 1v4h-4"
                                  transform="matrix(1 0 0 -1 0 6)"
                                ></path>
                              </g>
                            </g>
                          </svg>
                        </button>
                        <button
                          onClick={handleNext}
                          className={styles['modal-next']}
                        >
                          <Arrow cssClass={VTEXClasses.ARROW_RIGHT_CLASS} />
                        </button>
                      </div>
                      <div className={styles['zoom-controls']}></div>
                      <TransformComponent>
                        <img
                          src={image.imageUrl}
                          alt="Zoom da imagem"
                          className={styles['modal-image']}
                        />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              </div>
            ))}
          </Slider>
        </div>
      </Modal>
    </div>
  )
}

export default ImageSlider
