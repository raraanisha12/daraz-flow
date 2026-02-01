// ─────────────────────────────────────────────────────────────
// 02_search.cy.js — Login reuse (support/commands.js → cy.darazLogin()) → Search
// Repeat gardaina: login ek choti commands.js ma, sabai le tyahi use garne.
// ─────────────────────────────────────────────────────────────

const searchPage = require('../pages/searchPage')

describe('Flow 02 — Search', () => {
  before(() => {
    if (!Cypress.env('DARAZ_EMAIL') || !Cypress.env('DARAZ_PASSWORD')) {
      throw new Error('DARAZ_EMAIL / DARAZ_PASSWORD missing in cypress.env.json')
    }
    if (!Cypress.env('SEARCH_TERM')) {
      throw new Error('SEARCH_TERM is missing in cypress.env.json')
    }
  })

  it('should log in (reuse 01 login) then search', () => {
    cy.darazLogin()
    searchPage.search()
  })
})
