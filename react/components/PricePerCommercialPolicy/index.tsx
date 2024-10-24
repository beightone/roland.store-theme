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

  if (loading || !product) return null

  const { Price } =
    data?.product?.items?.[0]?.sellers?.[0]?.commertialOffer ?? null

  return (
    <div className={styles.priceWrapperProductSummary}>
      <span>{formatPrice(Price)}</span>
    </div>
  )
}

export default PricePerCommercialPolicy
