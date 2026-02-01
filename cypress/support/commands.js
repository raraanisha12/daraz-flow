// Shared Daraz login — Uses cy.session() for caching
// cy.darazLogin() - reliable login with session caching

Cypress.Commands.add('darazLogin', () => {
  const email = Cypress.env('DARAZ_EMAIL')
  const password = Cypress.env('DARAZ_PASSWORD')

  cy.session(
    [email],
    () => {
      cy.log('Starting login...')

      // Go directly to login page
      cy.visit('https://member.daraz.com.np/user/login', {
        timeout: 120000,
        failOnStatusCode: false
      })
      cy.wait(5000)

      // Wait for page to stabilize
      cy.document().its('readyState').should('eq', 'complete')

      // Wait for .loginWrap to appear (the main login form container)
      cy.get('.loginWrap', { timeout: 30000 }).should('be.visible').within(() => {
        cy.log('Found .loginWrap, filling login form...')

        // Find and fill email/phone input
        const emailSelectors = [
          'input[data-meta="Field"]',
          'input[name="loginId"]',
          'input[name="account"]',
          'input[name="username"]',
          'input[type="text"]',
          'input[type="email"]',
          'input[placeholder*="phone"]',
          'input[placeholder*="Phone"]',
          'input[placeholder*="email"]',
          'input[placeholder*="mobile"]',
          'input[placeholder*="number"]'
        ].join(', ')

        cy.get(emailSelectors, { timeout: 10000 })
          .first()
          .should('be.visible')
          .clear()
          .type(email, { delay: 100 })

        // Fill password
        cy.get('input[type="password"]', { timeout: 10000 })
          .first()
          .should('be.visible')
          .clear()
          .type(password, { delay: 100 })

        // Click login button
        cy.get('button[type="submit"], button:contains("Login"), button:contains("LOG IN"), button:contains("Log In")', { timeout: 10000 })
          .first()
          .should('be.visible')
          .click()
      })

      cy.wait(8000)
      cy.log('Login attempt completed')
    },
    {
      validate: () => {
        // Check if we're logged in by visiting homepage
        cy.visit('/', { timeout: 60000 })
        cy.wait(2000)
        // If #anonLogin exists, we're not logged in
        cy.get('body').then($body => {
          if ($body.find('#anonLogin').length > 0) {
            throw new Error('Not logged in - anonLogin still visible')
          }
        })
      },
      cacheAcrossSpecs: true
    }
  )

  // After session restore, visit homepage
  cy.visit('/', { timeout: 120000 })
  cy.wait(2000)

  // Close any popup/modal
  closePopups()

  cy.get('#q, input[placeholder*="Search"], input[name="q"], input[type="search"], .search-box__input--O34g', { timeout: 15000 })
    .first()
    .should('be.visible')
  cy.log('Homepage ready - User logged in')
})

// Helper to close popups
function closePopups() {
  cy.get('body').then($body => {
    const closeSelectors = '.next-dialog-close, [class*="modal-close"], [aria-label="Close"], .close-btn, .popup-close'
    if ($body.find(closeSelectors).length > 0) {
      cy.get(closeSelectors).first().click({ force: true })
      cy.wait(500)
    }
  })
}
