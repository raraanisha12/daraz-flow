describe('Daraz  Test', () => {
  

  it('Complete Daraz Test Flow:', () => {
    cy.wrap(null).then(() => Cypress.config('pageLoadTimeout', 120000))
    cy.log('Open Daraz ...')
    cy.visit('/', { timeout: 120000 })
    cy.wait(3000)
    
    cy.get('body').then($body => {
      if ($body.find('.next-dialog-close, [class*="modal-close"], [aria-label="Close"]').length > 0) {
        cy.get('.next-dialog-close, [class*="modal-close"], [aria-label="Close"]').first().click({ force: true })
        cy.wait(1000)
      }
    })
    
    cy.log('Website opened successfully')
    
    cy.log('Log in to Daraz...')
    
    cy.get('body').then($body => {
      // Try multiple selectors for login button
      const loginSelectors = [
        '#anonLogin',
        'a:contains("Login")',
        'a:contains("LOGIN")',
        '[data-spm="d_login"]',
        '.lzd-header-login'
      ]
      
      let found = false
      loginSelectors.forEach(selector => {
        if (!$body.find(selector).length) return
        cy.get(selector).first().click({ force: true })
        found = true
        return false
      })
      
      if (!found) {
        cy.contains('a', /login/i).first().click({ force: true })
      }
    })
    
    cy.wait(3000)
    
   // handle iframe as daraz has pop-up form for login
    cy.get('body').then($body => {
      if ($body.find('iframe[id*="login"], iframe[src*="login"]').length > 0) {

        cy.get('iframe[id*="login"], iframe[src*="login"]').then($iframe => {
          const iframeBody = $iframe.contents().find('body')

          cy.wrap(iframeBody).within(() => {

            cy.get('input[type="text"], input[placeholder*="phone"], input[placeholder*="email"]')
              .first()
              .clear()
              .type(Cypress.env('DARAZ_EMAIL'))
              .should('have.value', Cypress.env('DARAZ_EMAIL'))

            cy.get('input[type="password"]')
              .clear()
              .type(Cypress.env('DARAZ_PASSWORD'))
              .should('have.value', Cypress.env('DARAZ_PASSWORD'))

            cy.contains('button', /login/i)
              .should('be.enabled')  
              .click()
          })
        })

      } else {
        cy.get('input[type="text"], input[placeholder*="phone"], input[placeholder*="email"], input[name="username"]')
          .first()
          .clear()
          .type(Cypress.env('DARAZ_EMAIL'), { delay: 100 })
          .should('have.value', Cypress.env('DARAZ_EMAIL'))

        cy.get('input[type="password"]')
          .clear()
          .type(Cypress.env('DARAZ_PASSWORD'), { delay: 100 })
          .should('have.value', Cypress.env('DARAZ_PASSWORD'))

        cy.contains('button', /login/i)
          .should('be.enabled')  
          .click()
      }
    })

    
    cy.wait(5000)
    cy.log('ogin completed')
  })
})
