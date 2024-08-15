// Dependencies
import React, { useState } from 'react'

// Styles
import styles from './styles.css'

// Components
import { Spinner } from 'vtex.styleguide'

// Hooks
import { OrderForm } from 'vtex.order-manager'
import { useMutation } from 'react-apollo'

// Mutations
import REMOVE_ALL_PRODUCTS_MUTATION from '../../graphql/mutations/removeAllProductsFromCart.gql'

const { useOrderForm } = OrderForm

const PreOwnedPopupAlert = () => {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { orderForm } = useOrderForm()

  const [removeAllProductsFromCart] = useMutation(REMOVE_ALL_PRODUCTS_MUTATION)
  const handleDecline = () => {
    window.location.href = '/?sc=1'
  }

  const handleAccept = async () => {
    setIsLoading(true)

    try {
      const orderFormId = orderForm.id
      const itemsToRemove = orderForm.items.map(
        (_item: any, index: number) => ({
          index,
          quantity: 0,
        })
      )

      await removeAllProductsFromCart({
        variables: {
          orderFormId,
          orderItems: itemsToRemove,
        },
      })
    } catch (err) {
      console.error('Error while removing items from order form', err)
    } finally {
      setIsLoading(false)
      setIsModalOpen(false)
    }
  }

  if (!isModalOpen) return null

  return (
    <div
      className={styles.overlayContainer}
      role="dialog"
      aria-labelledby="popupTitle"
      aria-describedby="popupText"
    >
      <div className={styles.popupWrapper}>
        <div className={styles.popupIcon} aria-hidden="true">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0003 28H36.2717C38.2974 28 39.3102 28 40.1165 27.6223C40.8268 27.2897 41.4236 26.7555 41.8326 26.0863C42.297 25.3267 42.4089 24.32 42.6326 22.3068L43.8026 11.7767C43.8709 11.1618 43.9051 10.8543 43.8062 10.6163C43.7194 10.4073 43.5642 10.2339 43.3661 10.1246C43.1404 10 42.8311 10 42.2124 10H9.00028M4 4H6.49688C7.02612 4 7.29075 4 7.49778 4.10065C7.68004 4.18926 7.83107 4.33115 7.93088 4.50752C8.04424 4.70787 8.06075 4.97198 8.09376 5.50019L9.90624 34.4998C9.93925 35.028 9.95576 35.2921 10.0691 35.4925C10.1689 35.6689 10.32 35.8107 10.5022 35.8994C10.7093 36 10.9739 36 11.5031 36H38M15 43H15.02M33 43H33.02M16 43C16 43.5523 15.5523 44 15 44C14.4477 44 14 43.5523 14 43C14 42.4477 14.4477 42 15 42C15.5523 42 16 42.4477 16 43ZM34 43C34 43.5523 33.5523 44 33 44C32.4477 44 32 43.5523 32 43C32 42.4477 32.4477 42 33 42C33.5523 42 34 42.4477 34 43Z"
              stroke="black"
              strokeWidth="1.89313"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.popupContent}>
          <h3 id="popupTitle" className={styles.popupTitle}>
            Quer começar um novo carrinho?
          </h3>
          <p id="popupText" className={styles.popupText}>
            Os produtos <b>novos</b> e <b>seminovos</b> não podem ser
            adicionados ao mesmo carrinho simultaneamente.
          </p>
        </div>
        <div className={styles.popupActions}>
          <button className={styles.declineButton} onClick={handleDecline}>
            Não, quero manter meu carrinho
          </button>
          <button className={styles.acceptButton} onClick={handleAccept}>
            {isLoading ? <Spinner /> : 'Começar um novo carrinho'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreOwnedPopupAlert
