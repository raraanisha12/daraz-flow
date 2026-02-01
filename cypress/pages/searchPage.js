
class SearchPage {
  search() {
    const term = Cypress.env('SEARCH_TERM')

    if (!term) {
      throw new Error(
        'Search keyword is empty in cypress.env.json.\n' + ' Set it (e.g. "laptop") and re-run.')
    }

    cy.log(`searching for: "${term}"`)

    cy.get('#q, input[placeholder*="Search"], input[name="q"], input[type="search"]')
      .first()
      .clear({ force: true })
      .type(`${term}{enter}`, { delay: 100, force: true })

    cy.wait(8000)
    cy.log('search completed')

    this.verifyResultsLoaded()
  }
  verifyResultsLoaded() {
    cy.get('body').then(($body) => {
      const cards = $body.find('[data-qa-locator="product-item"]')

      if (cards.length === 0) {
        cy.fail(
          `NO RESULTS for "${Cypress.env('SEARCH_TERM')}".\n` +
          '   Possible causes:\n' +
          '     • The search term has no matching products on Daraz\n' +
          '     • The page did not finish loading\n' +
          '   Try a different SEARCH_TERM in cypress.env.json.'
        )
      }

      cy.log(`Search returned ${cards.length} product(s)`)
    })
  }
}

module.exports = new SearchPage()
