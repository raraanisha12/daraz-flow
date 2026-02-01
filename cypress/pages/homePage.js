class HomePage {
  visit() {
    cy.visit('/', { timeout: 120000 })
    cy.wait(3000)
    this.dismissModal()
  }
  dismissModal() {
    cy.get('body').then(($body) => {
      const closeSelectors = [
        '.next-dialog-close',
        '[class*="modal-close"]',
        '[aria-label="Close"]',
        '.next-dialog-wrap .next-btn',
        'button[aria-label="close"]',
      ]
      const selector = closeSelectors.join(', ')

      if ($body.find(selector).length > 0) {
        cy.get(selector).first().click({ force: true })
        cy.wait(1000)
      }
    })
  }
}

module.exports = new HomePage()
