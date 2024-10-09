import type { ReactNode } from 'react'
import React, { Fragment } from 'react'

type Props = {
  children: ReactNode
  isActive: boolean
}
const DisplayCondition = ({ children, isActive }: Props) => {
  if (!isActive) return null

  return <Fragment>{children}</Fragment>
}

DisplayCondition.schema = {
  type: 'object',
  properties: {
    isActive: {
      title: 'Está ativo?',
      type: 'boolean',
    },
  },
}

export default DisplayCondition
