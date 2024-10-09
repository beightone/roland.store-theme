import type { ReactNode } from 'react'
import React, { Fragment, useEffect, useMemo, useState } from 'react'

// Hooks
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

// Queries
import GET_ORDERFORM from './graphql/queries/getOrderForm.gql'
import GET_PRE_OWNED_PRODUCTS from './graphql/queries/getProductsFromCollection.gql'
import PreOwnedPopupAlert from './PreOwnedPopupAlert'

const ChallengeSellerChannel = ({ children }: { children: ReactNode }) => {
  const [showPopupAlert, setShowPopupAlert] = useState(false)
  const { data, loading: orderFormLoading } = useQuery(GET_ORDERFORM, {
    ssr: false,
  })

  const { data: preOwnedProducts, loading: productsLoading } = useQuery(
    GET_PRE_OWNED_PRODUCTS,
    {
      variables: { id: '169' },
      ssr: false,
    }
  )

  const { page, navigate } = useRuntime()

  const orderFormItems = useMemo(
    () => data?.orderForm.items ?? [],
    [data?.orderForm.items]
  )

  const preOwnedItems = useMemo(
    () => preOwnedProducts?.productsOrder.items ?? [],
    [preOwnedProducts?.productsOrder.items]
  )

  const hasPreOwnedProductInCart = orderFormItems.some((orderItem: any) =>
    preOwnedItems.some(
      (preOwnedItem: any) => preOwnedItem.skuId === orderItem.id
    )
  )

  useEffect(() => {
    if (orderFormLoading || productsLoading) {
      return
    }

    const isPreOwnedPage = page === 'store.custom#pre-owned'
    const isHomePage = page === 'store.home'
    const currentUrl = new URL(window.location.href)
    const hasScParameter = currentUrl.searchParams.has('sc')

    const hasRefreshed = currentUrl.searchParams.has('refreshed')

    if (isPreOwnedPage && !hasRefreshed) {
      currentUrl.searchParams.append('refreshed', 'true')
      window.location.href = currentUrl.toString()

      return
    }

    if (orderFormItems.length > 0) {
      if (isPreOwnedPage && !hasPreOwnedProductInCart) {
        setShowPopupAlert(true)
      }

      if (!isPreOwnedPage && hasPreOwnedProductInCart) {
        setShowPopupAlert(true)
      }

      if (isPreOwnedPage && !hasScParameter) {
        navigate({
          to: `${window.location.pathname}?sc=2`,
        })
      }
    } else {
      setShowPopupAlert(false)
    }

    if (isHomePage && !hasScParameter) {
      navigate({
        to: `${window.location.pathname}?sc=1`,
      })
    }
  }, [
    data,
    preOwnedProducts,
    page,
    navigate,
    hasPreOwnedProductInCart,
    orderFormItems,
    preOwnedItems,
    showPopupAlert,
    orderFormLoading,
    productsLoading,
  ])

  return (
    <Fragment>
      {children}
      {showPopupAlert && (
        <PreOwnedPopupAlert
          action={setShowPopupAlert}
          hasPreOwnedProductsOnCart={hasPreOwnedProductInCart}
          modalIsOpen
          orderFormId={data?.orderForm.id}
          orderFormItems={orderFormItems}
          isChallenge
        />
      )}
    </Fragment>
  )
}

export default React.memo(ChallengeSellerChannel)
