// Dependencies
import React, { Fragment, useMemo } from 'react'

// Styles
import styles from './styles.css'

// Components
import InputMask from 'react-input-mask'

// Hooks
import { useLazyQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'

// Queries
import GET_SHIPPING_ESTIMATE from '../../graphql/queries/getShippingEstimate.graphql'

// types
import type { ShippingData, ShippingEstimateVariables, SLA } from './types'

const ShippingCalculator: React.FC = () => {
  const { selectedItem, selectedQuantity } = useProduct() ?? {}

  const [getShippingEstimate, { data, loading }] = useLazyQuery<
    { shipping: ShippingData },
    ShippingEstimateVariables
  >(GET_SHIPPING_ESTIMATE, {
    fetchPolicy: 'network-only',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const variables: ShippingEstimateVariables = {
      items: [
        {
          id: selectedItem?.itemId ?? '',
          seller: selectedItem?.sellers?.[0]?.sellerId ?? '',
          quantity: selectedQuantity ?? 1,
        },
      ],
      country: 'BRA',
      postalCode: event.currentTarget.zipCode.value,
    }

    getShippingEstimate({
      variables,
    })
  }

  const shippingOptions: SLA[] = useMemo(
    () => data?.shipping?.logisticsInfo[0]?.slas ?? [],
    [data?.shipping?.logisticsInfo]
  )

  const cheapestOption: SLA | undefined = useMemo(() => {
    return shippingOptions.reduce((prev, curr) => {
      return curr.price < prev.price ? curr : prev
    }, shippingOptions[0])
  }, [shippingOptions])

  const fastestOption: SLA | undefined = useMemo(() => {
    return shippingOptions.reduce((prev, curr) => {
      const prevEstimate = parseInt(prev.shippingEstimate.replace('bd', ''), 10)
      const currEstimate = parseInt(curr.shippingEstimate.replace('bd', ''), 10)

      return currEstimate < prevEstimate ? curr : prev
    }, shippingOptions[0])
  }, [shippingOptions])

  return (
    <div className={styles['shipping-calculator-container']}>
      <form
        className={styles['shipping-calculator-form']}
        onSubmit={handleSubmit}
      >
        <label
          className={styles['shipping-calculator-label']}
          htmlFor="zipCode"
        >
          Calcule o frete e o prazo de entrega
        </label>
        <InputMask
          className={styles['shipping-calculator-input']}
          mask="99999-999"
          type="text"
          id="zipCode"
          name="zipCode"
          placeholder="00000-000"
        />
        <button className={styles['shipping-calculator-button']} type="submit">
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
        <small className={styles['shipping-calculator-idk-cep']}>
          <a
            href="http://www.buscacep.correios.com.br/"
            target="_blank"
            rel="noreferrer"
          >
            Não sei meu CEP
          </a>
        </small>
      </form>

      {data && (
        <Fragment>
          <table className={styles['shipping-options-table']}>
            <thead>
              <tr>
                <th>Envio</th>
                <th>Prazo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {cheapestOption && (
                <tr>
                  <td>+ Barato</td>
                  <td>
                    Até {cheapestOption.shippingEstimate.replace('bd', '')} dias
                    úteis
                  </td>
                  <td>
                    {cheapestOption.price === 0
                      ? 'Grátis'
                      : `R$ ${(cheapestOption.price / 100).toFixed(2)}`}
                  </td>
                </tr>
              )}
              {fastestOption && (
                <tr>
                  <td> + Rápido</td>
                  <td>
                    Até {fastestOption.shippingEstimate.replace('bd', '')} dias
                    úteis
                  </td>
                  <td>{`R$ ${(fastestOption.price / 100).toFixed(2)}`}</td>
                </tr>
              )}
            </tbody>
          </table>
          <span className={styles['shipping-calculator-disclaimer']}>
            *Estimativa de entrega e valores simulados.
          </span>
        </Fragment>
      )}
    </div>
  )
}

export default ShippingCalculator
