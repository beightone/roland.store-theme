// Dependencies
import React from 'react'

// Styles
import styles from './styles.css'

// Hooks
import { useQuery } from 'react-apollo'

// Queries
import GET_PRE_OWNED_PRODUCTS from '../../graphql/queries/getProductsFromCollection.gql'

// Contet
import { ItemContext } from 'vtex.product-list'

export const useItemContext = () => {
  try {
    return ItemContext?.useItemContext()
  } catch (error) {
    return null
  }
}

const PreOwnedCartFlag = () => {
  const { item } = useItemContext() ?? {}

  const { data, loading } = useQuery(GET_PRE_OWNED_PRODUCTS, {
    variables: { id: '169' },
    ssr: false,
  })

  const isPreOwned = data?.productsOrder.items.some(
    (preOwnedItem: any) => preOwnedItem.skuId === item?.id
  )

  if (!isPreOwned || loading) return null

  return <div className={styles.preOwnedFlag}>Seminovo</div>
}

export default PreOwnedCartFlag
