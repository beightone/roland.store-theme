// Dependencies
import type { ReactNode } from 'react'
import React, { Fragment, useEffect, useState } from 'react'

const PreOwnedSectionCondition = ({ children }: { children: ReactNode }) => {
  const [hasPreOwnedProducts, setHasPreOwnedProducts] = useState(false)
  const getPreOwnedCollection = async () => {
    try {
      const response = await fetch(
        '/api/catalog_system/pub/products/search?fq=productClusterIds:169'
      )

      const data = await response.json()

      // const isAvailable = data?.map((product: any) =>
      //   product.items.some(
      //     (item: any) => item.sellers[0].commertialOffer.AvailableQuantity > 0
      //   )
      // )

      // console.log('data.length', { data, isAvailable })
      setHasPreOwnedProducts(data?.length > 0)
    } catch (error) {
      console.error('Error while fetching pre-owned products', error)
    }
  }

  useEffect(() => {
    getPreOwnedCollection()
  }, [])

  if (!hasPreOwnedProducts) return null

  return <Fragment>{children}</Fragment>
}

export default PreOwnedSectionCondition
