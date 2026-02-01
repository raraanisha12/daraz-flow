// ─────────────────────────────────────────────────────────────
// e2e / 04_add_to_cart.cy.js
// Flow  : Login → Search → Filter → Open Product → Add to Cart
//       → Verify cart badge incremented by 1
// Errors: Any upstream step failure propagates its own cy.fail
//         "Add to Cart" not found    → cy.fail
//         Badge did not increment    → cy.fail with before/after
// ─────────────────────────────────────────────────────────────

const homePage    = require('../pages/homePage')
const loginPage   = require('../pages/loginPage')
const searchPage  = require('../pages/searchPage')
const filterPage  = require('../pages/filterPage')
const productPage = require('../pages/productPage')
const cartPage    = require('../pages/cartPage')

describe('Flow 04 — Add to Cart (Full Flow)', () => {
  before(() => {
    if (!Cypress.env('DARAZ_EMAIL') || !Cypress.env('DARAZ_PASSWORD')) {
      throw new Error('DARAZ_EMAIL / DARAZ_PASSWORD missing in cypress.env.json')
    }
    if (!Cypress.env('SEARCH_TERM')) {
      throw new Error('search keyword is missing in cypress.env.json')
    }
    if (!Cypress.env('BRAND_FILTER')) {
      throw new Error('brand filter is missing in cypress.env.json')
    }
  })

  it('should add a filtered product to the cart and verify the badge', () => {
    homePage.visit()
    loginPage.login()

    searchPage.search();

    filterPage.applyBrandFilter()
    productPage.openFirstProduct()
    cartPage.addToCart()      
  })
})
