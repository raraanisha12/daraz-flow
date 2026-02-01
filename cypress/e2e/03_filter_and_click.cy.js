// ─────────────────────────────────────────────────────────────
// e2e / 03_filter_and_click.cy.js
// Flow  : Login → Search → Apply brand checkbox (BRAND_FILTER)
//       → Click first product link
// Errors: Brand checkbox not found   → cy.fail with guidance
//         Zero products after filter  → cy.fail
//         Product page didn't load    → cy.fail
// ─────────────────────────────────────────────────────────────

const homePage    = require('../pages/homePage')
const loginPage   = require('../pages/loginPage')
const searchPage  = require('../pages/searchPage')
const filterPage  = require('../pages/filterPage')
const productPage = require('../pages/productPage')

describe('Flow 03 — Filter & Click Product', () => {
  before(() => {
    if (!Cypress.env('DARAZ_EMAIL') || !Cypress.env('DARAZ_PASSWORD')) {
      throw new Error('DARAZ_EMAIL / DARAZ_PASSWORD missing in cypress.env.json')
    }
    if (!Cypress.env('SEARCH_TERM')) {
      throw new Error('keyword is missing in cypress.env.json')
    }
    if (!Cypress.env('BRAND_FILTER')) {
      throw new Error('brand filter is missing in cypress.env.json')
    }
  })

  it(`should filter by "${Cypress.env('BRAND_FILTER')}" and open a product`, () => {
    homePage.visit()
    loginPage.login()
    searchPage.search()

    filterPage.applyBrandFilter()  

    productPage.openFirstProduct()  
  })
})
