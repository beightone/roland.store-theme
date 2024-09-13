// Dependencies
import React, { useRef } from 'react'
import Modal from 'react-modal'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

// Styles
import styles from '../styles.css'

// Components
import Slider from 'react-slick'
import Arrow from './Arrow'
import { CloseIcon } from './CloseIcon'
import { ZoomInIcon } from './ZoomInIcon'
import { ZoomOutIcon } from './ZoomOutIcon'
import { ResetIcon } from './ResetIcon'

// Types
interface ModalZoomProps {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
  filterImages?: Array<{ imageUrl: string; imageId: string }>
  activeSlideIndex?: number
  closeModal: () => void
  VTEXClasses: {
    ARROW_LEFT_CLASS: string
    ARROW_RIGHT_CLASS: string
  }
}

const ModalZoom = ({
  isModalOpen,
  setIsModalOpen,
  filterImages,
  activeSlideIndex = 0,
  VTEXClasses,
}: ModalZoomProps) => {
  const modalSliderRef = useRef<any>(null)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleNext = (fallback: () => void) => {
    fallback()
    modalSliderRef.current?.slickNext()
  }

  const handlePrev = (fallback: () => void) => {
    fallback()
    modalSliderRef.current?.slickPrev()
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

  return (
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
            <CloseIcon />
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
                        onClick={() => handlePrev(resetTransform)}
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
                        <ZoomInIcon />
                      </button>
                      <button
                        className={styles['zoom-out']}
                        onClick={(
                          _event: React.MouseEvent<HTMLButtonElement>
                        ) => zoomOut()}
                      >
                        <ZoomOutIcon />
                      </button>
                      <button
                        className={styles['reset-transform']}
                        onClick={(
                          _event: React.MouseEvent<HTMLButtonElement>
                        ) => resetTransform()}
                      >
                        <ResetIcon />
                      </button>
                      <button
                        onClick={() => handleNext(resetTransform)}
                        className={styles['modal-next']}
                      >
                        <Arrow cssClass={VTEXClasses.ARROW_RIGHT_CLASS} />
                      </button>
                    </div>
                    <div className={styles['zoom-controls']} />
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
  )
}

export default ModalZoom
