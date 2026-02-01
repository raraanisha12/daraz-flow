class ProductPage {
  openFirstProduct() {
    cy.get('body').then(($body) => {
      const cards = $body.find('[data-qa-locator="product-item"]')

      if (cards.length === 0) {
        cy.fail(
          'no product cards found to click.\n' +
          '   The search or filter may have returned zero results.'
        )
      }

      cy.log(`clicking product card (1 of ${cards.length})`)

      cy.get('[data-qa-locator="product-item"]')
        .first()
        .click()
    })

    cy.wait(6000)

  }
}

module.exports = new ProductPage()
