import React from 'react'

// Styles
import styles from './styles.css'

// Hooks
import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'

// Queries
import GET_PRICE_PER_COMMERCIAL_POLICY from '../../graphql/queries/getPricePerCommercialPolicy.gql'
import formatPrice from '../../utils/formatPrice'

interface PricePerCommercialPolicyProps {
  salesChannel: number
}

const PricePerCommercialPolicy = ({
  salesChannel,
}: PricePerCommercialPolicyProps) => {
  const { product } = useProduct() ?? {}

  const { data, loading } = useQuery(GET_PRICE_PER_COMMERCIAL_POLICY, {
    variables: {
      slug: product?.linkText,
      salesChannel,
    },
  })

  if (loading || !product || !data) return null
  const { Price, ListPrice, spotPrice, Installments } =
    data?.product?.items?.[0]?.sellers?.[0]?.commertialOffer ?? null
  const percentage = 100 * (spotPrice / Price) - 100
  const greaterInstallment = Installments.reduce(
    (
      max: { NumberOfInstallments: number },
      current: { NumberOfInstallments: number }
    ) => {
      return current.NumberOfInstallments > max.NumberOfInstallments
        ? current
        : max
    },
    Installments[0]
  )
  return (
    <div className={styles.priceWrapperProductSummary}>
      <span className={styles.priceWrapperProductSummary__listPrice}>
        {formatPrice(ListPrice)}
      </span>
      <p className={styles.priceWrapperProductSummary__spotPrice}>
        {formatPrice(spotPrice)}
        <span>no pix ou à vista </span>{' '}
        <span
          className={styles.priceWrapperProductSummary__spotPricePercentage}
        >
          {percentage.toFixed(0)}%
        </span>
      </p>
      {greaterInstallment?.NumberOfInstallments > 1 && (
        <p className={styles.priceWrapperProductSummary__installments}>
          <span>
            ou <b>{formatPrice(Price)}</b> em até{' '}
          </span>
          <b>{greaterInstallment.NumberOfInstallments}x</b>
          <span> de </span>
          <b>{formatPrice(greaterInstallment.Value)} </b>
          <span> sem juros </span>
        </p>
      )}
    </div>
  )
}

export default PricePerCommercialPolicy
