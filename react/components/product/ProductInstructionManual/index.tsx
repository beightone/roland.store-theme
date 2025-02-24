import React, { useEffect, useState } from 'react'
import styles from './styles.css'
import { useProduct } from 'vtex.product-context'
import { IProductProperties } from '../../../typings/productsInfos'
import { getPropertyByName } from '../../../utils/getPropertyByName'

const ProductInstructionManual: React.FC = () => {
  const [manualUrlInfo, setManualUrlInfo] = useState<string | null>(null)
  const context = useProduct()

  if (!context) return null
  const product = context?.product

  const properties = product?.properties as IProductProperties[] | undefined

  useEffect(() => {
    if (!properties) return

    const manualUrl = getPropertyByName(properties, 'Manual de instruções')

    setManualUrlInfo(manualUrl)
  }, [properties])

  return (
    <>
      {manualUrlInfo ? (
        <section
          className={styles.productInstructionManualContainer}
          id="manual"
        >
          <h3 className={styles.productInstructionManualTitle}>
            Manual de instruções
          </h3>
          <div className={styles.productInstructionManualContent}>
            <a
              className={styles.productInstructionManualLink}
              href={manualUrlInfo}
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="28"
                viewBox="0 0 27 28"
                fill="none"
              >
                <path
                  d="M13.3333 20.6667L5 12.3333L7.33333 9.91666L11.6667 14.25V0.666656H15V14.25L19.3333 9.91666L21.6667 12.3333L13.3333 20.6667ZM3.33333 27.3333C2.41667 27.3333 1.63222 27.0072 0.98 26.355C0.327777 25.7028 0.00111111 24.9178 0 24V19H3.33333V24H23.3333V19H26.6667V24C26.6667 24.9167 26.3406 25.7017 25.6883 26.355C25.0361 27.0083 24.2511 27.3344 23.3333 27.3333H3.33333Z"
                  fill="white"
                />
              </svg>
            </a>
            <p className={styles.productInstructionManualPhrase}>
              Clique{' '}
              <a
                className={styles.productInstructionManualSimpleLink}
                href={manualUrlInfo}
                target="_blank"
              >
                aqui
              </a>{' '}
              para baixar o <br /> manual de instruções.
            </p>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default ProductInstructionManual
