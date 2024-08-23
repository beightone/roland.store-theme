import type { ReactNode } from 'react'
import React, { Fragment, useEffect, useState } from 'react'

// Hooks
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

// Queries
import GET_ORDERFORM from './graphql/queries/getOrderForm.gql'
import GET_PRE_OWNED_PRODUCTS from './graphql/queries/getProductsFromCollection.gql'
import PreOwnedPopupAlert from './PreOwnedPopupAlert'

const ChallengeSellerChannel = ({ children }: { children: ReactNode }) => {
  const [showPopupAlert, setShowPopupAlert] = useState(false)
  const { data } = useQuery(GET_ORDERFORM, { ssr: false })
  const { data: preOwnedProducts } = useQuery(GET_PRE_OWNED_PRODUCTS, {
    variables: { id: '169' },
    ssr: false,
  })

  const { page, navigate } = useRuntime()

  const orderFormItems = data?.orderForm.items ?? []
  const preOwnedItems = preOwnedProducts?.productsOrder.items ?? []

  const hasPreOwnedProductInCart = orderFormItems.some((orderItem: any) =>
    preOwnedItems.some(
      (preOwnedItem: any) => preOwnedItem.productId === orderItem.id
    )
  )

  useEffect(() => {
    const isPreOwnedPage = page === 'store.custom#pre-owned'
    const hasScParameter = window.location.search.includes('sc=2')

    // Condição para exibir alerta
    if (
      (isPreOwnedPage &&
        orderFormItems.length > 0 &&
        !hasPreOwnedProductInCart) ||
      (!isPreOwnedPage && hasPreOwnedProductInCart)
    ) {
      setShowPopupAlert(true)
    }

    // Redirecionar para URL com `sc=2`
    if (isPreOwnedPage && !hasScParameter) {
      navigate({
        to: `${window.location.pathname}?sc=2`,
      })
    }
  }, [
    data,
    preOwnedProducts,
    page,
    navigate,
    hasPreOwnedProductInCart,
    orderFormItems.length,
  ])

  console.log('ChallengeSellerChannel', { hasPreOwnedProductInCart })

  return (
    <Fragment>
      {children}
      {showPopupAlert && (
        <PreOwnedPopupAlert
          action={setShowPopupAlert}
          hasPreOwnedProductsOnCart={hasPreOwnedProductInCart}
        />
      )}
    </Fragment>
  )
}

export default React.memo(ChallengeSellerChannel)
