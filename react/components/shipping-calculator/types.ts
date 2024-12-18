export interface SLA {
  id: string
  friendlyName: string
  price: number
  shippingEstimate: string
  shippingEstimateDate: string | null
}

export interface LogisticsInfo {
  itemIndex: string
  slas: SLA[]
}

export interface ShippingData {
  logisticsInfo: LogisticsInfo[]
}

export interface ShippingEstimateVariables {
  items: Array<{
    id: string
    seller: string
    quantity: number
  }>
  country: string
  postalCode: string
}
