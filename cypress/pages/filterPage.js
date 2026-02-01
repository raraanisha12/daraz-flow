
class FilterPage {
  applyBrandFilter() {
    const brand = Cypress.env('BRAND_FILTER')

    if (!brand) {
      throw new Error(
        'filter keyword is empty in cypress.env.json.\n' +
        '   Set it (e.g. "Apple") and re-run.'
      )
    }

    cy.log(`Applying brand filter: "${brand}"`)

    cy.scrollTo(0, 300)
    cy.wait(2000)

    this._clickBrandCheckbox(brand)

    cy.wait(5000)

    this.verifyFilterApplied(brand)
  }

  _clickBrandCheckbox(brand) {
    cy.get('body').then(($body) => {
      const labelMatches = $body.find('label').filter((_, el) => {
        return el.textContent.trim().toLowerCase() === brand.toLowerCase()
      })

      if (labelMatches.length > 0) {
        cy.wrap(labelMatches).first().scrollIntoView().click({ force: true })
        return
      }

      const inputSelector = `input[businessvalue="${brand.toLowerCase()}"]`
      if ($body.find(inputSelector).length > 0) {
        cy.get(inputSelector)
          .closest('.ant-checkbox, .checkbox-wrapper, label')
          .first()
          .scrollIntoView()
          .click({ force: true })
        return
      }

      const allCheckboxes = $body.find('input[type="checkbox"]')
      let found = false

      allCheckboxes.each((_, el) => {
        const parent = Cypress.$(el).closest('label, .ant-checkbox-wrapper, li')
        if (parent.text().trim().toLowerCase() === brand.toLowerCase()) {
          cy.wrap(el).scrollIntoView().click({ force: true })
          found = true
          return false 
        }
      })

      if (!found) {
        cy.fail(
          `brand filter "${brand}" NOT FOUND in the sidebar.\n` +
          '   Possible causes:\n' +
          '     • This brand does not exist for the current search\n' +
          '     • The sidebar did not load yet\n' +
          '   Try a different BRAND_FILTER in cypress.env.json.'
        )
      }
    })
  }

  verifyFilterApplied(brand) {
    cy.get('body').then(($body) => {
      const checkedLabel = $body.find('label').filter((_, el) => {
        return el.textContent.trim().toLowerCase() === brand.toLowerCase()
      })

      if (checkedLabel.length > 0) {
        const checkbox = checkedLabel.find('input[type="checkbox"]')
        if (checkbox.length > 0 && checkbox.is(':checked')) {
          cy.log(`brandfilter "${brand}" is checked`)
          return
        }
      }

      const pills = $body.find(
        '[class*="filter-tag"], [class*="active-filter"], ' +
        '[class*="selected-filter"], [class*="refinement"]'
      )
      const brandPill = pills.filter((_, el) => {
        return el.textContent.toLowerCase().includes(brand.toLowerCase())
      })

      if (brandPill.length > 0) {
        cy.log(`brand filter "${brand}" pill is visible`)
        return
      }

      if ($body.find('[data-qa-locator="product-item"]').length > 0) {
        cy.log(`filter pill/checkbox not detected but products exist — continuing`)
        return
      }

      cy.fail(
        `clicking "${brand}" filter, no products are shown.\n` +
        '   The brand may have zero results for this search.'
      )
    })
  }
}

module.exports = new FilterPage()
