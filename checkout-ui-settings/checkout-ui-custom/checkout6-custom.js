/* eslint-disable no-undef */
const getVtexAddress = async (postalCode) => {
  try {
    const response = await fetch(`/api/checkout/pub/postal-code/BRA/${postalCode}`)

    if (!response.ok) throw new Error('Erro ao buscar endereço na VTEX')

    const address = await response.json()

    if (address.city === '') {
      throw new Error('Endereço não encontrado')
    }

    return address
  } catch (error) {
    console.error('Error getting VTEX address', error)

    return null
  }
}

const getAddressByViaCep = async (postalCode) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${postalCode.replace('-', '')}/json/`)

    if (!response.ok) throw new Error('Erro ao buscar endereço no ViaCep')

    return await response.json()
  } catch (error) {
    console.error('Error getting ViaCep address', error)

    return { erro: true }
  }
}

function updateBreadcrumb() {
  const currentURL = window.location.href
  const { orderForm } = vtexjs.checkout
  const { items } = orderForm

  if (items.length === 0) {
    const stepElement = document.querySelector('.checkout-steps')

    if (stepElement) {
      stepElement.style.display = 'none'
    }

    return
  }

  const updateClasses = (selectors, addClasses = [], removeClasses = []) => {
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)

      elements.forEach((element) => {
        addClasses.forEach((cls) => element.classList.add(cls))
        removeClasses.forEach((cls) => element.classList.remove(cls))
      })
    })
  }

  const step = currentURL.split('/').pop()
  const stepsConfig = {
    cart: {
      active: ['.checkout-steps__item[step="cart"]'],
      inactive: [
        '.checkout-steps__item[step="profile"]',
        '.checkout-steps__item[step="shipping"]',
        '.checkout-steps__item[step="payment"]',
      ],
    },
    email: {
      active: ['.checkout-steps__item[step="profile"]'],
      completed: ['.checkout-steps__item[step="cart"]'],
      uncompleted: ['.checkout-steps__item[step="shipping"]', '.checkout-steps__item[step="payment"]'],
      inactive: [
        '.checkout-steps__item[step="shipping"]',
        '.checkout-steps__item[step="payment"]',
        '.checkout-steps__item[step="cart"]',
      ],
    },
    profile: {
      active: ['.checkout-steps__item[step="profile"]'],
      completed: ['.checkout-steps__item[step="cart"]'],
      uncompleted: ['.checkout-steps__item[step="shipping"]', '.checkout-steps__item[step="payment"]'],
      inactive: [
        '.checkout-steps__item[step="shipping"]',
        '.checkout-steps__item[step="payment"]',
        '.checkout-steps__item[step="cart"]',
      ],
    },
    shipping: {
      active: ['.checkout-steps__item[step="profile"]', '.checkout-steps__item[step="shipping"]'],
      completed: ['.checkout-steps__item[step="cart"]', '.checkout-steps__item[step="profile"]'],
      inactive: ['.checkout-steps__item[step="payment"]'],
    },
    payment: {
      active: [
        '.checkout-steps__item[step="profile"]',
        '.checkout-steps__item[step="shipping"]',
        '.checkout-steps__item[step="payment"]',
      ],
      completed: [
        '.checkout-steps__item[step="cart"]',
        '.checkout-steps__item[step="profile"]',
        '.checkout-steps__item[step="shipping"]',
      ],
    },
    confirmation: {
      active: [
        '.checkout-steps__item[step="profile"]',
        '.checkout-steps__item[step="shipping"]',
        '.checkout-steps__item[step="payment"]',
      ],
      completed: [
        '.checkout-steps__item[step="cart"]',
        '.checkout-steps__item[step="profile"]',
        '.checkout-steps__item[step="shipping"]',
        '.checkout-steps__item[step="payment"]',
      ],
    },
  }

  const config = stepsConfig[step] || {}

  updateClasses(config.active || [], ['active'], ['completed'])
  updateClasses(config.completed || [], ['completed'])
  updateClasses(config.uncompleted || [], [], ['completed'])
  updateClasses(config.inactive || [], [], ['active'])
}

function showDeliveryOptions() {
  const { hash } = window.location

  if (hash !== '#/cart') return

  const observer = new MutationObserver((mutations, obs) => {
    const shippingCalculatorElement = document.querySelector('.cart-template .cart-more-options')

    const alreadyAppended = !!document.querySelector('.cart-template.active .summary-totalizers .cart-more-options')
    const summaryTotalizersElement = document.querySelector('.summary-totalizers')

    if (!shippingCalculatorElement || alreadyAppended) {

      return
    }

    if (!summaryTotalizersElement) {
      return
    }
    summaryTotalizersElement.insertAdjacentHTML('beforeend', shippingCalculatorElement.outerHTML)
    buildShippingBar()
    buildShippingOptions()
    obs.disconnect()
  })

  const config = {
    childList: true,
    subtree: true,
  }

  observer.observe(document.body, config)
}
function buildShippingOptions() {
  const observer = new MutationObserver((mutations, obs) => {
    const deliverySelect = document.querySelector('.summary-totalizers .srp-delivery-select')
    const originalDeliverySelect = document.querySelector('.srp-delivery-select')
    if (deliverySelect) {
      const createdRadioOptionsElement = document.querySelector('.radio-options-container')
      if (createdRadioOptionsElement) {
        obs.disconnect()
        return
      }
      const optionsElements = deliverySelect.querySelectorAll('option')
      const radioContainer = document.createElement('div')
      radioContainer.classList.add('radio-options-container')
      function updateSelect(value) {
        originalDeliverySelect
          .querySelector(`option[value="${value}"]`)
          .parentNode.click()
        deliverySelect.value = value
        originalDeliverySelect.value = value
        deliverySelect.dispatchEvent(
          new CustomEvent('change', { bubbles: true })
        )
        originalDeliverySelect.dispatchEvent(
          new CustomEvent('change', { bubbles: true })
        )
      }
      function extractText(optionText) {
        const parts = optionText.split(' - ')
        const text = parts[0]
        const price = parts[1] || ''
        return { text, price }
      }
      optionsElements.forEach(option => {
        const { text, price } = extractText(option.textContent)
        const labelHtml = `
            <label class="vtex-omnishipping-1-x-leanShippingOption">
              <input type="radio" name="delivery-option" value="${option.value
          }" class="radio-option-input" ${option.selected ? 'checked' : ''}>
              <div class="vtex-omnishipping-1-x-leanShippingIcon"></div>
              <div class="vtex-omnishipping-1-x-leanShippingText">
                <span>${text}</span>
              </div>
              <span class="vtex-omnishipping-1-x-optionPrice">${price}</span>
            </label>
          `
        radioContainer.innerHTML += labelHtml
      })
      radioContainer
        .querySelectorAll('input[type="radio"]')
        .forEach(radio => {
          radio.addEventListener('change', function (evt) {
            updateSelect(radio.value)
            document
              .querySelectorAll('.vtex-omnishipping-1-x-leanShippingOption')
              .forEach(label =>
                label.classList.remove('shp-lean-option-active')
              )
            radio
              .closest('.vtex-omnishipping-1-x-leanShippingOption')
              .classList.add('shp-lean-option-active')
          })
          if (radio.value === deliverySelect.value) {
            radio.checked = true
            radio
              .closest('.vtex-omnishipping-1-x-leanShippingOption')
              .classList.add('shp-lean-option-active')
          }
        })
      deliverySelect.parentNode.insertBefore(radioContainer, deliverySelect)
      obs.disconnect()
    }
  })
  const config = {
    childList: true,
    subtree: true,
  }
  observer.observe(document.body, config)
}

function updateShippingBar() {
  const minValue = 200
  const orderForm = vtexjs.checkout.orderForm
  const itemsValue = orderForm.totalizers.find(({ id }) => id === 'Items')?.value || 0
  const differenceToMinValue = (itemsValue - minValue * 100) / 100
  const progressPercentage = Math.min(
    100,
    (itemsValue / (minValue * 100)) * 100
  )
  const textWrapperElement = document.querySelector(
    '.shipping-bar-wrapper .shipping-bar-text'
  )
  if (!textWrapperElement) return
  const textContentElement = textWrapperElement.querySelector('p')
  const valueElement = textContentElement?.querySelector('.value')
  const fullBarTextElement = textWrapperElement.querySelector(
    '.value-reached'
  )
  const progressBarElement = document.querySelector('.shipping-bar-progress')

  if (differenceToMinValue < 0) {
    if (valueElement)
      valueElement.textContent = `R$ ${Math.abs(differenceToMinValue).toFixed(
        2
      )}`
    if (progressBarElement)
      progressBarElement.style.width = `${progressPercentage}%`
    fullBarTextElement.style.display = 'none'
    textContentElement.style.display = 'block'
  } else {
    fullBarTextElement.style.display = 'block'
    textContentElement.style.display = 'none'
    if (progressBarElement) progressBarElement.style.width = '100%'
  }
}

function buildShippingBar() {
  const { hash } = window.location

  if (hash !== '#/cart') return null
  const shippingBarElement = $('.shipping-bar-wrapper')

  shippingBarElement.appendTo('.cart-template.active .summary-totalizers .cart-more-options')
  updateShippingBar()
}

function validatePostalCode() {
  const { hash } = window.location

  if (hash !== '#/shipping') return

  async function handlePostalCodeChange(postalCode) {
    try {
      removeExistingErrors()
      await handleVtexAddress(postalCode)
      showShippingStep()
    } catch (error) {
      console.error('Erro ao validar o código postal:', error)
    }
  }

  async function initObserver(postalCodeInput) {
    const observer = new MutationObserver(async (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'value' && postalCodeInput.value.length >= 8) {
          await handlePostalCodeChange(postalCodeInput.value)
        }
      }
    })

    observer.observe(postalCodeInput, {
      attributes: true,
      attributeFilter: ['value'],
    })

    console.log('Observando mudanças no código postal:', postalCodeInput.value)
    await handlePostalCodeChange(postalCodeInput.value)
  }

  function waitForPostalCodeInput() {
    const postalCodeInput = document.getElementById('ship-postalCode')

    if (postalCodeInput) {
      initObserver(postalCodeInput)
    } else {
      setTimeout(waitForPostalCodeInput, 500)
    }
  }

  waitForPostalCodeInput()
}

async function handleVtexAddress(postalCode) {
  const existOnVtex = await getVtexAddress(postalCode)

  if (!existOnVtex) {
    const addressViaCep = await getAddressByViaCep(postalCode)

    if (!addressViaCep.erro) {
      fillAddressForm(addressViaCep)
    } else {
      console.error('CEP não encontrado')
    }
  }
}

function fillAddressForm(address) {
  const { bairro, logradouro, localidade, uf } = address
  const streetInput = document.getElementById('ship-street')
  const neighborhoodInput = document.getElementById('ship-neighborhood')
  const cityInput = document.getElementById('ship-city')
  const stateSelect = document.getElementById('ship-state')

  if (streetInput && neighborhoodInput && cityInput && stateSelect) {
    streetInput.value = logradouro || ''
    neighborhoodInput.value = bairro || ''
    cityInput.value = localidade || ''
    stateSelect.value = uf || ''

  }
}

function showShippingStep() {
  const shippingContainer = document.getElementById('shipping-data')

  shippingContainer.classList.remove('postal-code-error')
  shippingContainer.classList.add('visible')
}

function removeExistingErrors() {
  const errorClass = document.querySelector('postal-code-error')

  if (errorClass) {
    errorClass.classList.remove('postal-code-error')
  }
}

function handleCouponSuccess() {
  if (!window.vtexjs) return
  const { vtexjs = {} } = window
  const { checkout = {} } = vtexjs
  const { orderForm = {} } = checkout
  const { marketingData = {} } = orderForm
  const { totalizers = [] } = orderForm
  const cartTemplateGroup = document.querySelectorAll('.cart-template')
  const existDiscount = totalizers.find((item) => item.id.toLowerCase() === 'discounts')

  if (marketingData && marketingData.coupon && existDiscount) {
    return cartTemplateGroup.forEach((el) => {
      el.classList.add('valid-coupon')
    })
  }

  const vtexCustomMsgCouponEl = document.querySelector('.vcustom-showCustomMsgCoupon')

  if (marketingData && marketingData.coupon && vtexCustomMsgCouponEl) {
    return cartTemplateGroup.forEach((el) => {
      el.classList.add('coupon-not-applicable')
    })
  }

  return cartTemplateGroup.forEach((el) => {
    el.classList.remove('valid-coupon')
    el.classList.remove('coupon-not-applicable')
  })
}

function settingCupomToggle() {
  const couponTitleArray = document.querySelectorAll('.coupon-form .coupon-fieldset .coupon-label')
  const couponElementArray = document.querySelectorAll('.coupon.summary-coupon')

  function toggleFieldsDisplay() {
    couponElementArray.forEach((field) => {
      if (field.classList.contains('hideElement')) {
        field.classList.remove('hideElement')
      } else {
        field.classList.add('hideElement')
      }
    })
  }

  couponTitleArray.forEach((title) => {
    title.addEventListener('click', toggleFieldsDisplay)
  })
}

function addingPixPriceIntoSummaryTotalizers() {
  const priceWithDiscountsElement = document.querySelector('.summary-totalizers tfoot tr td.monetary')
  const subtotalElements = document.querySelectorAll('.summary-totalizers .Items .monetary')

  if (priceWithDiscountsElement) {
    const pixPriceElement = document.querySelector('.valueOfSubtotal')

    if (pixPriceElement) return
    const subtotalHTML = priceWithDiscountsElement.innerHTML

    subtotalElements.forEach((element) => {
      element.innerHTML = `
        <span class="valueOfSubtotal">${subtotalHTML}</span>
        <span class="valueText">no pix ou boleto</span>
        <p class="valueOfSubtotal subtotalCardValue">${element.innerHTML} <span class="valueText">no cartão</span> </p>

      `
    })
  }
}

$(window).on('load', function () {
  showDeliveryOptions()
  setTimeout(() => {
    updateBreadcrumb()
    settingCupomToggle()
    addingPixPriceIntoSummaryTotalizers()
  }, 4000)
})

$(window).on('hashchange', function () {
  showDeliveryOptions()
  updateBreadcrumb()
  addingPixPriceIntoSummaryTotalizers()
  setTimeout(() => {
    settingCupomToggle()
  }, 1000)
  const { orderForm } = vtexjs.checkout

  if (orderForm) {
    validatePostalCode()
  }
})

$(window).on('orderFormUpdated.vtex', function (evt, orderForm) {
  validatePostalCode()
  handleCouponSuccess()
  setTimeout(() => {
    settingCupomToggle()
  }, 1000)
})

window.addEventListener('DOMContentLoaded', () => {
  window.vtexjs.checkout.getOrderForm()
})
