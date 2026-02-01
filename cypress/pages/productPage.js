class ProductPage {
  // Try to open a product that has Add to Cart available
  // Will try up to 3 products (index 0, 1, 2)
  openFirstProduct(productIndex = 0) {
    const maxAttempts = 3

    cy.get('body').then(($body) => {
      const cards = $body.find('[data-qa-locator="product-item"]')

      if (cards.length === 0) {
        cy.fail(
          'no product cards found to click.\n' +
          '   The search or filter may have returned zero results.'
        )
      }

      if (productIndex >= cards.length || productIndex >= maxAttempts) {
        cy.fail(
          `Tried ${productIndex} products but none had "Add to Cart" available.\n` +
          '   All products may be out of stock.'
        )
      }

      cy.log(`Clicking product ${productIndex + 1} of ${cards.length}`)

      cy.get('[data-qa-locator="product-item"]')
        .eq(productIndex)
        .click({ force: true })
    })

    cy.wait(6000)
    this.verifyPageLoaded()

    // Store current product index for retry
    cy.wrap(productIndex).as('currentProductIndex')
  }

  // Try next product if current one is out of stock
  tryNextProduct() {
    cy.get('@currentProductIndex').then((currentIndex) => {
      cy.log(`Product ${currentIndex + 1} out of stock, trying next...`)
      cy.go('back')
      cy.wait(3000)
      this.openFirstProduct(currentIndex + 1)
    })
  }

  verifyPageLoaded() {
    cy.get('body').then(($body) => {
      const hasTitle =
        $body.find('h1').length > 0 ||
        $body.find('[data-qa*="title"]').length > 0 ||
        $body.find('.next-title, .product-title, [class*="productTitle"]').length > 0

      if (!hasTitle) {
        cy.fail(
          'Product detail page did not load — no title element found.\n' +
          '   The click may have navigated to an unexpected page.\n' +
          '   Check the screenshot for the current URL.'
        )
      }

      cy.log('detail page loaded successfully')
    })
  }
}

module.exports = new ProductPage()
