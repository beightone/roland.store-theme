import type { IProductProperties } from '../typings/productsInfos'

export function getPropertyByName(
  properties: IProductProperties[],
  name: string
) {
  const property = properties.find((p) => p.name === name)

  if (!property) return null

  return property?.values[0]
}
