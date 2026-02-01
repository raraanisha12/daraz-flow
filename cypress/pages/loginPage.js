class LoginPage {
  login() {
    // Go directly to login page URL
    cy.visit('https://member.daraz.com.np/user/login', {
      timeout: 120000,
      failOnStatusCode: false
    })
    cy.wait(5000)
    cy.document().its('readyState').should('eq', 'complete')

    this.fillAndSubmit()
    cy.wait(5000)
    this.verifyLogin()
  }

  fillAndSubmit() {
    const email = Cypress.env('DARAZ_EMAIL')
    const password = Cypress.env('DARAZ_PASSWORD')

    if (!email || !password) {
      throw new Error(
        'email or password is empty.\n' +
        '   Fill them in  cypress.env.json  and re-run.'
      )
    }

    // Wait for .loginWrap container
    cy.get('.loginWrap', { timeout: 30000 }).should('be.visible').within(() => {
      this._typeEmail(email)
      this._typePassword(password)
      this._clickSubmit()
    })
  }

  verifyLogin() {
    cy.visit('/', { timeout: 60000 })
    cy.wait(2000)
    cy.get('body').then(($body) => {
      if ($body.find('#anonLogin').length > 0) {
        cy.fail(
          'login— #anonLogin is still visible.\n' +
          '   Possible causes:\n' +
          '     • Wrong email / password in cypress.env.json\n' +
          '     • Account is locked\n' +
          '     • Captcha was shown (not handled here)\n' +
          '   Check the screenshot for details.'
        )
      }
    })
    cy.log('✅ Login verified — user menu is visible')
  }

  _typeEmail(email) {
    const emailSel = [
      'input[data-meta="Field"]',
      'input[type="text"]',
      'input[type="email"]',
      'input[placeholder*="phone"]',
      'input[placeholder*="Phone"]',
      'input[placeholder*="email"]',
      'input[placeholder*="Email"]',
      'input[placeholder*="mobile"]',
      'input[placeholder*="Mobile"]',
      'input[name="username"]',
      'input[name="email"]',
      'input[name="loginId"]',
      'input[name="account"]'
    ].join(', ')

    cy.get(emailSel, { timeout: 10000 })
      .first()
      .should('be.visible')
      .clear()
      .type(email, { delay: 100 })
  }

  _typePassword(password) {
    cy.get('input[type="password"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .clear()
      .type(password, { delay: 100 })
  }

  _clickSubmit() {
    cy.get('button[type="submit"], button:contains("Login"), button:contains("LOG IN"), button:contains("Log In")', { timeout: 10000 })
      .first()
      .should('be.visible')
      .click()
  }
}

module.exports = new LoginPage()
