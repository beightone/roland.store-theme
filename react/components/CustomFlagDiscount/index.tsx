import React, { Fragment } from 'react'
import { useProduct } from 'vtex.product-context'

// Types
interface CustomFlagDiscountProps {
  children: React.ReactNode
  flagType: string
  backgroundColor: string
  color: string
}

const CustomFlagDiscount: StorefrontFunctionComponent<
  CustomFlagDiscountProps
> = ({ children, flagType, backgroundColor, color }) => {
  const { product } = useProduct() ?? {}

  const hasDiscount =
    product?.priceRange?.listPrice.highPrice !==
    product?.priceRange?.sellingPrice.highPrice

  if (!hasDiscount) {
    return null
  }

  const style: React.CSSProperties = {
    backgroundColor,
    color,
    fontFamily: 'Monument Extended',
    fontSize: flagType === '-n%' ? '14px' : '9px',
    borderRadius: flagType === '-n%' ? '16px' : '50%',
    padding: flagType === '-n%' ? '4px' : '9px 4px',
    display: 'flex',
    flexDirection: flagType === '-n%' ? 'row' : 'column',
    position: 'absolute',
    zIndex: '1',
  }

  return (
    <div style={style}>
      <Fragment>
        {flagType === '-n%' && <span>-</span>}
        {children}
        {flagType === 'n%off' && (
          <span style={{ fontSize: '12px', fontWeight: '700' }}>OFF</span>
        )}
      </Fragment>
    </div>
  )
}

CustomFlagDiscount.schema = {
  title: 'Tipo de flag',
  type: 'object',
  properties: {
    flagType: {
      title: 'Qual o tipo de flag?',
      enum: ['-n%', 'n%off'],
      enumNames: ['-50%', '50% OFF'],
      default: '-n%',
    },
    backgroundColor: {
      title: 'Cor de fundo',
      type: 'string',
      widget: {
        'ui:widget': 'color',
      },
      default: '#FF5A00',
    },
    color: {
      title: 'Cor do texto',
      type: 'string',
      widget: {
        'ui:widget': 'color',
      },
      default: '#FFFFFF',
    },
  },
}

export default CustomFlagDiscount
