import type { ReactNode } from 'react'
import React, { Fragment, useEffect, useMemo, useState } from 'react'

// Components
import PreOwnedPopupAlert from './PreOwnedPopupAlert'

// Hooks
import { useQuery } from 'react-apollo'
// @ts-ignore
import { useRuntime } from 'vtex.render-runtime'

// Queries
import GET_ORDERFORM from './graphql/queries/getOrderForm.gql'
import GET_PRE_OWNED_PRODUCTS from './graphql/queries/getProductsFromCollection.gql'

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

  const { page, route } = useRuntime()

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
    if (orderFormLoading || productsLoading || !preOwnedItems?.length) {
      return
    }

    const isPreOwnedPage = page === 'store.custom#pre-owned'
    const isHomePage = page === 'store.home'
    const isProductPage = page === 'store.product'
    const isPreOwnedProduct = document.referrer.includes('seminovos')

    const currentUrl = new URL(window.location.href)
    const hasScParameter = currentUrl.searchParams.has('sc')
    const hasRefreshed = currentUrl.searchParams.has('refreshed')

    console.log('isPreOwnedPage', isPreOwnedPage, document.referrer)

    if (isProductPage && isPreOwnedProduct && !hasScParameter) {
      currentUrl.searchParams.set('sc', '2')
      window.location.href = currentUrl.toString()

      return
    }

    if (isProductPage && !isPreOwnedProduct && !hasScParameter) {
      currentUrl.searchParams.set('sc', '1')
      window.location.href

      return
    }

    if (isProductPage && !isPreOwnedProduct && !hasScParameter) {
      currentUrl.searchParams.set('sc', '1')

      window.location.href = currentUrl.toString()

      return
    }

    if (isPreOwnedPage && !hasScParameter) {
      currentUrl.searchParams.set('sc', '2')
      currentUrl.searchParams.set('refreshed', 'true')
      window.location.href = currentUrl.toString()

      return
    }

    if (isPreOwnedPage && !hasRefreshed) {
      currentUrl.searchParams.set('refreshed', 'true')
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
    } else {
      setShowPopupAlert(false)
    }

    if (isHomePage && !hasScParameter) {
      currentUrl.searchParams.set('sc', '1')
      window.location.href = currentUrl.toString()
    }
  }, [
    data,
    preOwnedProducts,
    page,
    hasPreOwnedProductInCart,
    orderFormItems,
    preOwnedItems,
    showPopupAlert,
    orderFormLoading,
    productsLoading,
    route.params.id,
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
