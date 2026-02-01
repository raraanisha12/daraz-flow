// ─────────────────────────────────────────────────────────────
// pages/cartPage.js
// - read the current cart badge count
// - click "Add to Cart"
// - if not available, try next product (up to 3)
// - dismiss any post-add modal/popup
// - re-read the badge and assert it incremented by 1
// ─────────────────────────────────────────────────────────────

const productPage = require('./productPage')

class CartPage {
  addToCart(attempt = 0) {
    const maxAttempts = 3

    this.getCartCount().then((before) => {
      cy.log(`Cart count BEFORE add: ${before}`)

      // Check if Add to Cart button exists
      cy.get('body').then(($body) => {
        const hasAddToCart = this._hasAddToCartButton($body)

        if (!hasAddToCart) {
          cy.log(`Product ${attempt + 1} has no "Add to Cart" button (out of stock?)`)

          if (attempt < maxAttempts - 1) {
            // Try next product
            cy.log(`Trying product ${attempt + 2}...`)
            cy.go('back')
            cy.wait(3000)

            // Click next product
            cy.get('[data-qa-locator="product-item"]')
              .eq(attempt + 1)
              .click({ force: true })
            cy.wait(6000)

            // Retry addToCart with next product
            this.addToCart(attempt + 1)
          } else {
            cy.fail(
              `Tried ${maxAttempts} products but none had "Add to Cart" available.\n` +
              '   All products may be out of stock.'
            )
          }
          return
        }

        // Add to Cart button found, click it
        this._clickAddToCart()
        cy.wait(3000)
        this._dismissPostAddModal()
        cy.wait(2000)

        this.getCartCount().then((after) => {
          cy.log(`Cart count AFTER add: ${after}`)

          if (after !== before + 1) {
            cy.log('Cart count did not increase, product may be out of stock')

            if (attempt < maxAttempts - 1) {
              // Try next product
              cy.log(`Trying product ${attempt + 2}...`)
              cy.go('back')
              cy.wait(3000)

              cy.get('[data-qa-locator="product-item"]')
                .eq(attempt + 1)
                .click({ force: true })
              cy.wait(6000)

              this.addToCart(attempt + 1)
            } else {
              cy.fail(
                `add to cart — badge did not increase.\n` +
                `   Before: ${before}  |  After: ${after}  |  Expected: ${before + 1}\n` +
                '   Tried all available products.'
              )
            }
            return
          }

          cy.log('item added to cart — badge incremented by 1')
        })
      })
    })
  }

  _hasAddToCartButton($body) {
    const addBtn = $body.find('button').filter((_, el) => {
      return /^Add to Cart$/i.test(el.textContent.trim())
    })
    if (addBtn.length > 0) return true

    if ($body.find('.add-to-cart-buy-now-btn').length > 0) return true

    const fallback = $body.find('button, a').filter((_, el) => {
      return /add.*cart/i.test(el.textContent)
    })
    if (fallback.length > 0) return true

    return false
  }

  getCartCount() {
    const badgeSelectors = [
      '#topActionCartNumber',
      '[data-qa-locator="cart-count"]',
      '.cart-count',
      '[class*="cartCount"]',
      '[class*="cart-number"]',
    ]

    return cy.get('body').then(($body) => {
      for (const sel of badgeSelectors) {
        const el = $body.find(sel)
        if (el.length > 0) {
          const raw = el.first().text().trim()
          return Number(raw) || 0
        }
      }
      return 0
    })
  }

  _clickAddToCart() {
    cy.get('body').then(($body) => {
      const addBtn = $body.find('button').filter((_, el) => {
        return /^Add to Cart$/i.test(el.textContent.trim())
      })

      if (addBtn.length > 0) {
        cy.wrap(addBtn).first().scrollIntoView().click({ force: true })
        return
      }

      if ($body.find('.add-to-cart-buy-now-btn').length > 0) {
        cy.get('.add-to-cart-buy-now-btn').first().click({ force: true })
        return
      }

      const fallback = $body.find('button, a').filter((_, el) => {
        return /add.*cart/i.test(el.textContent)
      })

      if (fallback.length > 0) {
        cy.wrap(fallback).first().scrollIntoView().click({ force: true })
        return
      }
    })
  }

  _dismissPostAddModal() {
    cy.get('body').then(($body) => {
      const closeSelectors = [
        '.next-dialog-close',
        '[class*="modal-close"]',
        '[aria-label="Close"]',
        'button[aria-label="close"]',
        '.next-dialog-wrap .next-btn:last-child',
      ]
      const selector = closeSelectors.join(', ')

      if ($body.find(selector).length > 0) {
        cy.get(selector).first().click({ force: true })
        cy.wait(1000)
      }
    })
  }
}

module.exports = new CartPage()
