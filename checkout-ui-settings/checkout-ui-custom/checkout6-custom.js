let isPostalCodeBeingValidated = false

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
    // console.error('Error getting VTEX address', error)

    return null
  }
}

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
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
async function isOnPostalCodeRange(postalCode) {
  return await validateRangePostalCode(postalCode)
}
async function validateRangePostalCode(postalCode) {
  try {
    const response = await fetch(`/api/dataentities/CR/search?isActive=true&_fields=FinalRange,initialRange`)

    if (!response.ok) throw new Error('Erro ao buscar intervalos de CEP na VTEX')
    const addressRanges = await response.json()

    const isWithinRange = addressRanges.some((range) => {
      const initialRange = parseInt(range.initialRange, 10)
      const finalRange = parseInt(range.FinalRange, 10)
      const code = parseInt(postalCode.replace('-', ''), 10)

      return code >= initialRange && code <= finalRange
    })

    return isWithinRange
  } catch (error) {
    console.error('Error getting VTEX address', error)

    return false
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

// function showDeliveryOptionsElement() {
//   const { hash } = window.location

//   if (hash !== '#/cart') return
//   function addingShippingSearchAction(calculateShippingLinkElements, mainObserver) {
//     const parentShippingInput0 = calculateShippingLinkElements[0].closest('.cart-more-options #shipping-preview-container.srp-container')
//     const parentShippingInput1 = calculateShippingLinkElements[1].closest('.cart-more-options #shipping-preview-container.srp-container')

//     if (!parentShippingInput0 || !parentShippingInput1) {
//       return
//     }

//     function updatePostalCode() {
//       calculateShippingLinkElements[0].click()
//       calculateShippingLinkElements[0].dispatchEvent(new CustomEvent('change', { bubbles: true }))
//     }

//     function copyContent() {
//       parentShippingInput1.innerHTML = parentShippingInput0.innerHTML

//       const submitButton = parentShippingInput1.querySelector('#cart-shipping-calculate')
//       const postalCodeInput = parentShippingInput1.querySelector('#ship-postalCode')

//       if (submitButton && postalCodeInput) {
//         submitButton.addEventListener('click', async (event) => {
//           event.preventDefault()
//           const postalCode = postalCodeInput.value
//           const orderFormId = vtexjs.checkout.orderFormId
//           const endpoint = `/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`

//           const payload = ({
//             selectedAddresses: [
//               {
//                 addressType: 'residential',
//                 receiverName: null,
//                 isDisposable: true,
//                 postalCode: postalCode,
//                 city: null,
//                 state: null,
//                 country: 'BRA',
//                 geoCoordinates: [],
//                 street: null,
//                 number: null,
//                 neighborhood: null,
//                 complement: null,
//                 reference: null,
//                 addressQuery: "",
//               },
//             ],
//             clearAddressIfPostalCodeNotFound: !1,
//           })

//           try {
//             const response = await fetch(endpoint, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify(payload)
//             })

//             if (!response.ok) {
//               throw new Error(`Erro na requisição: ${response.statusText}`)
//             }

//             const data = await response.json()
//             location.reload()
//           } catch (error) {
//             console.error('Erro ao enviar o CEP:', error)
//           }
//         })

//       }

//       mutationObserver.disconnect()
//     }

//     const mutationObserver = new MutationObserver((mutations, obs) => {
//       copyContent()
//     })

//     const config = { childList: true, subtree: true }

//     calculateShippingLinkElements[1].addEventListener('click', function () {
//       updatePostalCode()
//       mutationObserver.observe(parentShippingInput0, config)
//     })

//     mainObserver.disconnect()
//   }

//   const observer = new MutationObserver((mutations, obs) => {
//     if (window.location.hash !== '#/cart') {
//       observer.disconnect()
//     }
//     const shippingCalculatorElement = document.querySelector('.cart-template .cart-more-options')
//     const alreadyAppended = !!document.querySelector('.cart-template.active .summary-totalizers .cart-more-options')
//     const summaryTotalizersElement = document.querySelector('.summary-totalizers')
//     const elementIsLoading = !!document.querySelector('.cart-template .cart-more-options .srp-container .srp-skeleton')
//     const elementNotLoaded = document.querySelector('.cart-template .cart-more-options .srp-container .srp-content')

//     if (!shippingCalculatorElement || !summaryTotalizersElement || alreadyAppended || elementIsLoading) {
//       return
//     }

//     summaryTotalizersElement.insertAdjacentHTML('beforeend', shippingCalculatorElement.outerHTML)
//     const calculateShippingLinkElements = document.querySelectorAll('#shipping-preview-container.srp-container .srp-data #shipping-calculate-link')
//     if (calculateShippingLinkElements.length >= 2) {
//       addingShippingSearchAction(calculateShippingLinkElements, obs)
//     } else {
//       buildShippingOptions()
//       buildShippingBar()
//       handlePostalCodeChange()
//     }
//   })

//   const config = {
//     childList: true,
//     subtree: true,
//   }

//   observer.observe(document.body, config)
// }
// function handlePostalCodeChange() {
//   const allChangeLinkShippingPostalCodeElements = document.querySelectorAll('.srp-address-title')

//   if (allChangeLinkShippingPostalCodeElements.length === 2) {
//     allChangeLinkShippingPostalCodeElements[1].addEventListener('click', () => {
//       allChangeLinkShippingPostalCodeElements[0].click()
//       const cloneShippingElement = document.querySelector('.cart-template.active .summary-totalizers .cart-more-options')
//       cloneShippingElement.remove()
//       // showDeliveryOptionsElement()
//     })
//   }
// }

function showDeliveryOptions() {
  const { hash } = window.location
  if (hash !== '#/cart') return

  const observer = new MutationObserver((mutations, obs) => {
    const shippingCalculator = $('.cart-template .cart-template-holder .cart-more-options')
    const targetContainer = document.querySelector('.cart-template.full-cart.active .summary-totalizers')
    const alreadyAppended = !!targetContainer.querySelector('.cart-more-options')

    if (shippingCalculator.length && !alreadyAppended) {
      setTimeout(() => {
        shippingCalculator.appendTo(targetContainer)
        buildShippingBar()
        buildShippingOptions()
        debouncedValidatePostalCode()
      }, 1000)
    }
  })

  const config = {
    childList: true,
    subtree: true,
  }

  observer.observe(document.body, config)
}

function buildShippingOptions() {
  const observer = new MutationObserver((mutations, obs) => {
    const deliverySelect = document.querySelector('.srp-delivery-select')

    if (deliverySelect) {
      if (document.querySelector('.radio-options-container')) {
        obs.disconnect()

        return
      }

      const options = deliverySelect.querySelectorAll('option')

      const radioContainer = document.createElement('div')

      radioContainer.classList.add('radio-options-container')

      function updateSelect(value) {
        deliverySelect.querySelector(`option[value="${value}"]`).parentNode.click()

        deliverySelect.value = value
        deliverySelect.dispatchEvent(new CustomEvent('change', { bubbles: true }))
      }

      function extractText(optionText) {
        const parts = optionText.split(' - ')
        const text = parts[0]
        const price = parts[1] || ''

        return { text, price }
      }

      options.forEach((option) => {
        const { text, price } = extractText(option.textContent)

        const labelHtml = `
        <label class="vtex-omnishipping-1-x-leanShippingOption">
          <input type="radio" name="delivery-option" value="${option.value}" class="radio-option-input" ${
          option.selected ? 'checked' : ''
        }>
          <div class="vtex-omnishipping-1-x-leanShippingIcon"></div>
          <div class="vtex-omnishipping-1-x-leanShippingText">
            <span>${text}</span>
          </div>
          <span class="vtex-omnishipping-1-x-optionPrice">${price}</span>
        </label>
      `

        radioContainer.innerHTML += labelHtml
      })

      radioContainer.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('change', function (evt) {
          updateSelect(radio.value)

          document
            .querySelectorAll('.vtex-omnishipping-1-x-leanShippingOption')
            .forEach((label) => label.classList.remove('shp-lean-option-active'))

          radio.closest('.vtex-omnishipping-1-x-leanShippingOption').classList.add('shp-lean-option-active')
        })

        if (radio.value === deliverySelect.value) {
          radio.checked = true
          radio.closest('.vtex-omnishipping-1-x-leanShippingOption').classList.add('shp-lean-option-active')
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
  const progressPercentage = Math.min(100, (itemsValue / (minValue * 100)) * 100)
  const textWrapperElement = document.querySelector('.shipping-bar-wrapper .shipping-bar-text')
  if (!textWrapperElement) return
  const textContentElement = textWrapperElement.querySelector('p')
  const valueElement = textContentElement?.querySelector('.value')
  const fullBarTextElement = textWrapperElement.querySelector('.value-reached')
  const progressBarElement = document.querySelector('.shipping-bar-progress')

  if (differenceToMinValue < 0) {
    if (valueElement) valueElement.textContent = `R$ ${Math.abs(differenceToMinValue).toFixed(2)}`
    if (progressBarElement) progressBarElement.style.width = `${progressPercentage}%`
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
  const alreadyAppended = !!document.querySelector('.cart-more-options .shipping-bar-wrapper')

  if (alreadyAppended) return

  shippingBarElement.appendTo('.cart-template.active .summary-totalizers .cart-more-options')
  updateShippingBar()
}

function validatePostalCode() {
  const { hash } = window.location

  if (hash === '#/shipping' || hash === '#/cart') {
    async function handlePostalCodeChange(postalCode) {
      if (isPostalCodeBeingValidated) return
      isPostalCodeBeingValidated = true

      try {
        removeExistingErrors()
        await handleVtexAddress(postalCode)
      } catch (error) {
        console.error('Erro ao validar o código postal:', error)
      } finally {
        isPostalCodeBeingValidated = false
      }
    }

    async function initObserver(postalCodeInput) {
      const observer = new MutationObserver(async (mutationsList) => {
        for (const mutation of mutationsList) {
          const formattedValue = postalCodeInput.value.replace(/\D/g, '')
          if (mutation.type === 'attributes' && mutation.attributeName === 'value' && formattedValue.length >= 8) {
            await handlePostalCodeChange(postalCodeInput.value)
            observer.disconnect()
          }
        }
      })

      observer.observe(postalCodeInput, {
        attributes: true,
        attributeFilter: ['value'],
      })
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
}

function displayError() {
  const { hash } = window.location
  removeExistingErrors()

  const shippingContainer =
    hash === '#/cart' ? document.querySelector('.cart-template') : document.getElementById('shipping-data')

  if (!shippingContainer) return

  shippingContainer.classList.add('postal-code-error')
  shippingContainer.classList.remove('visible')

  if (hash === '#/cart') {
    const elementExist = setInterval(() => {
      const resetPostalCodeButton = document.querySelector('#deliver-at-text .srp-address-title')
      if (resetPostalCodeButton) {
        clearInterval(elementExist)
        resetPostalCodeButton.click()
      }
    }, 1000)
  }
}

function removeExistingErrors() {
  const errorClass = document.querySelector('.postal-code-error')
  if (errorClass) {
    errorClass.classList.remove('postal-code-error')
  }
}

// TODO: MELHORAR LÓGICA DESTA FUNÇÃO
async function handleVtexAddress(postalCode) {
  const existOnVtex = await getVtexAddress(postalCode)

  if (existOnVtex === null) {
    const addressViaCep = await getAddressByViaCep(postalCode)
    const isOnRange = await isOnPostalCodeRange(postalCode)

    if (!addressViaCep.erro) {
      fillAddressForm(addressViaCep)
      showShippingStep()
      removeExistingErrors()
    } else if (!isOnRange) {
      displayError()
    } else {
      showShippingStep()
      removeExistingErrors()
    }
  } else {
    removeExistingErrors()
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
  const { hash } = window.location

  const shippingContainer =
    hash === '#/cart' ? document.querySelector('.cart-template') : document.getElementById('shipping-data')

  shippingContainer.classList.remove('postal-code-error')
  shippingContainer.classList.add('visible')
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

    const { items, totalizers } = vtexjs.checkout.orderForm
    const totalWithoudDiscount = totalizers.find((item) => item.id === 'Items').value
    const pricePixInfos = items.reduce((acc, item) => acc + item.sellingPrice, 0)
    const priceCreditFormatted = (totalWithoudDiscount / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    const pricePixFormatted = (pricePixInfos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    if (totalWithoudDiscount === pricePixInfos) return

    subtotalElements.forEach((element) => {
      element.innerHTML = `
        <span class="valueOfSubtotal">${pricePixFormatted}</span>
        <span class="valueText">no pix ou boleto</span>
        <p class="valueOfSubtotal subtotalCardValue">${priceCreditFormatted} <span class="valueText">no cartão</span> </p>

      `
    })
  }
}

function checkProductPrice() {
  const { items } = vtexjs?.checkout?.orderForm
  const products = [...document.querySelectorAll('.cart-template .cart-template-holder .product-item')]

  products?.map((product, index) => {
    const item = items[index]
    const hasPixPrice = item.sellingPrice !== item.price
    const alreadyAppended = !!product.querySelector('.hide-pix-price')

    if (!hasPixPrice && !alreadyAppended) {
      product.classList.add('hide-pix-price')
    } else if (hasPixPrice && alreadyAppended) {
      product.classList.remove('hide-pix-price')
    }
  })
}

function checkSharedCart() {
  const {hash} = window.location

  if ( hash !== '#/payment') return null

  const inStoreParams = new URLSearchParams(window.location.search)
  const orderId = inStoreParams.get('orderFormId')
  const code = inStoreParams.get('code')

  const isSharedCart = orderId && code

  if (isSharedCart) {
    document.querySelector("body").classList.add('shared-cart')
    
    (document.querySelector('#payment-group-PagalevePixAVistaTransparentePaymentGroup'), setDefaultPayment)
  }

}

function setDefaultPayment() {
  const element = document.querySelector('#payment-group-PagalevePixAVistaTransparentePaymentGroup')

  if (element) {
    element.click()
  }
}

function observeElement(nodeElement, action) {
  const { hash } = window.location
  if (hash !== '#/cart') return

  const targetNode = document.querySelector('body')

  if (!targetNode) {
    return
  }

  const config = { childList: true, subtree: true }

  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const elements = nodeElement
        if (elements) {
          action()
          observer.disconnect()
          break
        }
      }
    }
  }

  const observer = new MutationObserver(callback)
  observer.observe(targetNode, config)
}
const debouncedValidatePostalCode = debounce(validatePostalCode, 300)


$(window).on('load', function () {
  showDeliveryOptions()
  checkSharedCart()
  observeElement(document.querySelectorAll('.cart-template .cart-template-holder .product-item'), checkProductPrice)
  observeElement(
    document.querySelector('.summary-totalizers tfoot tr td.monetary'),
    addingPixPriceIntoSummaryTotalizers
  )
  setTimeout(() => {
    updateBreadcrumb()
    settingCupomToggle()
  }, 2000)
})

$(window).on('hashchange', function () {
  updateBreadcrumb()
  checkSharedCart()
  observeElement(document.querySelectorAll('.cart-template .cart-template-holder .product-item'), checkProductPrice)
   observeElement(
     document.querySelector('.summary-totalizers tfoot tr td.monetary'),
     addingPixPriceIntoSummaryTotalizers
   )
  const { hash } = window.location
  if (hash === '#/cart') location.reload()
  setTimeout(() => {
    settingCupomToggle()
  }, 1000)
  const { orderForm } = vtexjs.checkout

  if (orderForm) {
    debouncedValidatePostalCode()
  }
})

$(window).on('orderFormUpdated.vtex', function (evt, orderForm) {
  debouncedValidatePostalCode()
  handleCouponSuccess()
  showDeliveryOptions()
  checkSharedCart()
  observeElement(document.querySelectorAll('.cart-template .cart-template-holder .product-item'), checkProductPrice)
  observeElement(
    document.querySelector('.summary-totalizers tfoot tr td.monetary'),
    addingPixPriceIntoSummaryTotalizers
  )
  setTimeout(() => {
    settingCupomToggle()
    showDeliveryOptions()
    addingPixPriceIntoSummaryTotalizers()
  }, 1000)
})

window.addEventListener('DOMContentLoaded', () => {
  window.vtexjs.checkout.getOrderForm()
})
