import React, { useState } from 'react'
// Styles
import styles from './styles.css'

const ProductLinkShare = () => {
  const [isCopied, setIsCopied] = useState(false)

  const handleButtonClick = async () => {
    if (isCopied === true) {
      setIsCopied(false)

      return
    }

    const productLink = window.location.href

    try {
      await navigator.clipboard.writeText(productLink)
      setIsCopied(true)
    } catch (error) {
      console.error('Erro ao copiar o link:', error)
    }
  }

  return (
    <button onClick={handleButtonClick} className={styles['share-button']}>
      {isCopied ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M8.53002 10.1878L12.2766 6.44124C12.8619 5.85597 13.8134 5.85585 14.3987 6.44124L8.53002 10.1878ZM8.53002 10.1878L7.5137 9.17148C7.51367 9.17146 7.51365 9.17143 7.51363 9.17141C6.92841 8.58604 5.97688 8.58614 5.3916 9.17134L8.53002 10.1878ZM14.3986 8.56341C14.9841 7.9782 14.984 7.02662 14.3988 6.44131L5.39153 9.17141C4.80613 9.75665 4.80625 10.7082 5.39153 11.2935L7.46661 13.3686L7.46662 13.3686C7.75665 13.6586 8.1393 13.81 8.52514 13.81C8.91097 13.81 9.29363 13.6586 9.58366 13.3686L14.0552 8.89707L14.0602 8.90168L14.3986 8.56341ZM0.5 10C0.5 4.75092 4.75092 0.5 10 0.5C15.2491 0.5 19.5 4.75092 19.5 10C19.5 15.2487 15.2491 19.5 10 19.5C4.75133 19.5 0.5 15.2491 0.5 10Z"
              fill="black"
              stroke="black"
            />
          </svg>
          <span className={styles['share-button-copied-text']}>
            Link copiado
          </span>
        </>
      ) : (
        <svg
          className={styles['share-button-icon']}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M13.3033 5.03C14.4542 3.87916 16.3192 3.87916 17.47 5.03V5.03C18.6208 6.18083 18.6208 8.04583 17.47 9.19666L12.5708 14.0958C11.42 15.2467 9.555 15.2467 8.40417 14.0958V14.0958C7.25334 12.945 7.25334 11.08 8.40417 9.92916L9.13667 9.19666"
            stroke="#FF5A00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.69666 15.8033C5.54583 16.9542 3.68083 16.9542 2.53 15.8033V15.8033C1.37916 14.6525 1.37916 12.7875 2.53 11.6367L7.42916 6.73751C8.58 5.58668 10.445 5.58668 11.5958 6.73751V6.73751C12.7467 7.88835 12.7467 9.75335 11.5958 10.9042L10.8333 11.6667"
            stroke="#FF5A00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}

export default ProductLinkShare
