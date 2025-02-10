// Dependencies
import type { FC } from 'react'
import React, { useState } from 'react'

// Styles
import styles from './styles.css'

// Types
interface BuyButtonPopupContentProps {
  BuyButton: React.FC<{ disabled: boolean }>
  RichText: React.FC
}

const BuyButtonPopupContent: FC<BuyButtonPopupContentProps> = ({
  BuyButton,
  RichText,
}) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <div className={styles['custom-buy-button-popup-content']}>
      <div className="popup-text">
        <RichText />
      </div>
      <div className={styles['popup-checkbox']}>
        <label className={styles['custom-checkbox']}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <span className={styles.checkmark} />
          Estou ciente da Política de entrega Roland
        </label>
      </div>
      <div className={styles['popup-buy-button']}>
        <BuyButton disabled={!isChecked} />
      </div>
    </div>
  )
}

export default BuyButtonPopupContent
