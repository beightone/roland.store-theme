/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// Dependencies
import type { ReactNode } from 'react'
import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react'

// Hooks
import { OrderForm } from 'vtex.order-manager'

// Components
import PreOwnedPopupAlert from '../PreOwnedPopupAlert'

const { useOrderForm } = OrderForm

const SalesChannelriggerCondition = ({ children }: { children: ReactNode }) => {
  const { orderForm } = useOrderForm()
  const ref = useRef<HTMLSpanElement>(null)
  const [showPopupAlert, setShowPopupAlert] = useState(false)
  const [hasPreOwnedProductsOnCart, setHasPreOwnedProductsOnCart] =
    useState(false)

  const preOwnedProductIds = useMemo(() => {
    const fetchPreOwnedProducts = async () => {
      try {
        const response = await fetch(
          '/api/catalog_system/pub/products/search?fq=productClusterIds:169'
        )

        const data = await response.json()

        return data.map((product: any) => product.productId)
      } catch (error) {
        console.error('Error while fetching pre-owned products', error)

        return []
      }
    }

    return fetchPreOwnedProducts()
  }, [])

  useEffect(() => {
    const checkPreOwnedProductsInCart = async () => {
      const preOwnedIds = await preOwnedProductIds
      const hasPreOwned = orderForm.items.some((item: any) =>
        preOwnedIds.includes(item.productId)
      )

      setHasPreOwnedProductsOnCart(hasPreOwned)
    }

    checkPreOwnedProductsInCart()
  }, [orderForm, preOwnedProductIds])

  const handleClick = useCallback(
    (evt: MouseEvent) => {
      evt.preventDefault()
      evt.stopPropagation()

      const link = ref.current?.querySelector('a')?.getAttribute('href')

      if (hasPreOwnedProductsOnCart) {
        setShowPopupAlert(true)
      } else {
        window.location.href = link ?? '/?sc=1'
      }
    },
    [orderForm.items, hasPreOwnedProductsOnCart]
  )

  useEffect(() => {
    const link = ref.current?.children?.[0] as HTMLAnchorElement

    link.addEventListener('click', handleClick)

    return () => {
      link.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  return (
    <Fragment>
      <span ref={ref}>{children}</span>
      {showPopupAlert && (
        <PreOwnedPopupAlert
          action={setShowPopupAlert}
          hasPreOwnedProductsOnCart
        />
      )}
    </Fragment>
  )
}

export default SalesChannelriggerCondition
