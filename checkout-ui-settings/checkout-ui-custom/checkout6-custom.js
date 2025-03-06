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

function showDeliveryOptions() {
  const { hash } = window.location
  if (hash !== '#/cart') return

  const observer = new MutationObserver((mutations, obs) => {
    const shippingCalculator = $('.cart-template .cart-template-holder .cart-more-options')
    const targetContainer = document.querySelector('.cart-template.full-cart.active .summary-totalizers')
    const alreadyAppended = !!targetContainer?.querySelector('.cart-more-options')

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

function configurePostalCodeInput(postalCodeInput) {
  postalCodeInput.setAttribute('maxlength', '9')

  const formatPostalCode = () => {
    let value = postalCodeInput.value

    value = value.replace(/\D/g, '')

    value = value.slice(0, 8)

    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2')
    }

    postalCodeInput.value = value
  }

  postalCodeInput.addEventListener('keyup', formatPostalCode)
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
        configurePostalCodeInput(postalCodeInput)
        initObserver(postalCodeInput)
        if (hash === '#/shipping') {
          addTriggerIntoChangeShippingInformation()
        }
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
function insertWarningEditAddressPopUp() {
  if (document.querySelector('#custom-warning-popup')) return

  const modalOverlay = document.createElement('div')
  modalOverlay.id = 'custom-warning-popup'
  modalOverlay.classList.add('custom-warning-overlay')

  const modalBox = document.createElement('div')
  modalBox.classList.add('custom-warning-box')
  const closeButton = document.createElement('button')
  closeButton.classList.add('close-warning-button')
  closeButton.innerHTML = `
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.5 16C0.5 7.43959 7.43959 0.5 16 0.5C24.5604 0.5 31.5 7.43959 31.5 16C31.5 24.5604 24.5604 31.5 16 31.5C7.43959 31.5 0.5 24.5604 0.5 16Z"
        stroke="#D4D4D8"
      />
      <path
        d="M20.1663 11.8335L11.833 20.1668M11.833 11.8335L20.1663 20.1668"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  `

  const message = document.createElement('p')
  message.classList.add('custom-warning-message')
  message.innerText = 'Você deseja alterar o endereço manualmente, mantendo o CEP informado?'

  const confirmButton = document.createElement('button')
  confirmButton.classList.add('custom-warning-button', 'confirm-button')
  confirmButton.innerText = 'Confirmar'

  const cancelButton = document.createElement('button')
  cancelButton.classList.add('custom-warning-button', 'cancel-button')
  cancelButton.innerText = 'Cancelar'

  confirmButton.addEventListener('click', () => {
    const shippingAddressEditElement = document.querySelector(
      '.vtex-omnishipping-1-x-addressSummary .vtex-omnishipping-1-x-linkEdit'
    )
    if (shippingAddressEditElement) {
      shippingAddressEditElement.click()
    }

    modalOverlay.remove()
  })
  closeButton.addEventListener('click', () => {
    modalOverlay.remove()
  })
  cancelButton.addEventListener('click', () => {
    modalOverlay.remove()
  })
  modalBox.appendChild(closeButton)
  modalBox.appendChild(message)
  modalBox.appendChild(confirmButton)
  modalBox.appendChild(cancelButton)
  modalOverlay.appendChild(modalBox)
  document.body.appendChild(modalOverlay)
}

function addTriggerIntoChangeShippingInformation() {
  const checkAndAttachListener = setInterval(() => {
    const shippingAddressEditElement = document.querySelector(
      '.vtex-omnishipping-1-x-addressSummary .vtex-omnishipping-1-x-linkEdit'
    )

    if (shippingAddressEditElement) {
      const cloneChangeAddressButtonExistent = document.querySelector('.clone-change-address-button')
      if (cloneChangeAddressButtonExistent) {
        cloneChangeAddressButtonExistent.remove()
      }
      const cloneChangeAddressButton = document.createElement('button')
      cloneChangeAddressButton.classList.add('clone-change-address-button')
      shippingAddressEditElement.parentNode.appendChild(cloneChangeAddressButton)
      cloneChangeAddressButton.addEventListener('click', () => {
        insertWarningEditAddressPopUp()
      })

      clearInterval(checkAndAttachListener)
    }
  }, 750)
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
  const { hash } = window.location

  if (hash !== '#/payment') return null

  const inStoreParams = new URLSearchParams(window.location.search)
  const orderId = inStoreParams.get('orderFormId')
  const code = inStoreParams.get('code')

  const isSharedCart = orderId && code

  if (isSharedCart) {
    document.querySelector('body')?.classList?.add('shared-cart')

    setDefaultPayment()
  }
}

function setDefaultPayment() {
  const element = document.querySelector('#payment-group-PagalevePixAVistaTransparentePaymentGroup')

  if (element) {
    element?.click()
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

async function checkPostalCodeOnLoad() {
  const { hash } = window.location
  const { postalCode } = vtexjs.checkout.orderForm.shippingData.selectedAddresses[0] ?? {}
  if (postalCode && hash === '#/cart') {
    await handleVtexAddress(postalCode)
  } else if (postalCode && hash === '#/shipping') {
    addTriggerIntoChangeShippingInformation()
  }
}

const debouncedValidatePostalCode = debounce(validatePostalCode, 300)

$(window).on('load', async function () {
  showDeliveryOptions()
  checkSharedCart()
  observeElement(document.querySelectorAll('.cart-template .cart-template-holder .product-item'), checkProductPrice)
  observeElement(
    document.querySelector('.summary-totalizers tfoot tr td.monetary'),
    addingPixPriceIntoSummaryTotalizers
  )
  await checkPostalCodeOnLoad()
  setTimeout(() => {
    updateBreadcrumb()
    settingCupomToggle()
  }, 2000)
})

$(window).on('hashchange', async function () {
  updateBreadcrumb()
  checkSharedCart()
  observeElement(document.querySelectorAll('.cart-template .cart-template-holder .product-item'), checkProductPrice)
  observeElement(
    document.querySelector('.summary-totalizers tfoot tr td.monetary'),
    addingPixPriceIntoSummaryTotalizers
  )

  setTimeout(() => {
    settingCupomToggle()
  }, 1000)

  const { orderForm } = vtexjs.checkout

  if (orderForm) {
    debouncedValidatePostalCode()
    await checkPostalCodeOnLoad()
  }
})

$(window).on('orderFormUpdated.vtex', function (evt, orderForm) {
  debouncedValidatePostalCode()
  handleCouponSuccess()
  showDeliveryOptions()
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
