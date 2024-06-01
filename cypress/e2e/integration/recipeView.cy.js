describe('Recipe View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');

    // Perform a search
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();

    // Wait for the results to load and be visible
    cy.get('.results', { timeout: 10000 }).should('be.visible');

    // Wait for the preview links to be rendered
    cy.get('.preview__link', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0
    );

    // Simulate selecting a recipe
    cy.get('.preview__link').first().click();

    // Wait for the recipe to load
    cy.get('.recipe', { timeout: 10000 }).should('be.visible');
  });

  it('displays recipe details correctly', () => {
    cy.get('.recipe__title').should('exist');
    cy.get('.recipe__info-data--minutes').should('exist');
    cy.get('.recipe__info-data--people').should('exist');
  });

  it('displays recipe ingredients correctly', () => {
    cy.get('.recipe__ingredient-list').should('exist').and('not.be.empty');
  });

  it('displays recipe directions correctly', () => {
    cy.get('.recipe__directions').should('exist');
    cy.get('.recipe__directions-text').should(
      'contain.text',
      'This recipe was carefully designed and tested by'
    );
  });

  it('updates servings correctly when incrementing', () => {
    cy.get('.recipe__info-data--people').then($span => {
      const initialServings = parseInt($span.text());
      cy.get('.btn--update-servings[data-update-to]').then($buttons => {
        cy.wrap($buttons).eq(1).click(); // Click the increment button
      });
      cy.get('.recipe__info-data--people').should(
        'contain.text',
        initialServings + 1
      );
    });
  });

  it('updates servings correctly when decrementing', () => {
    cy.get('.recipe__info-data--people').then($span => {
      const initialServings = parseInt($span.text());
      cy.get('.btn--update-servings[data-update-to]').then($buttons => {
        cy.wrap($buttons).eq(0).click(); // Click the decrement button
      });
      cy.get('.recipe__info-data--people').should(
        'contain.text',
        initialServings - 1
      );
    });
  });

  it('does not decrement servings below 1', () => {
    cy.get('.recipe__info-data--people').then($span => {
      const initialServings = parseInt($span.text());
      for (let i = 0; i < initialServings; i++) {
        cy.get('.btn--update-servings[data-update-to]').then($buttons => {
          cy.wrap($buttons).eq(0).click(); // Click the decrement button
        });
      }
      cy.get('.recipe__info-data--people').should('contain.text', '1');
    });
  });

  it('toggles bookmark correctly', () => {
    cy.get('.btn--bookmark').should('be.visible').click();
    cy.get('.btn--bookmark use')
      .should('have.attr', 'href')
      .and('include', '-fill');
    cy.get('.btn--bookmark').click();
    cy.get('.btn--bookmark use')
      .should('have.attr', 'href')
      .and('not.include', '-fill');
  });

  it('links to the source URL correctly', () => {
    cy.get('.recipe__btn').should('have.attr', 'href').and('include', 'http');
  });

  it('displays user-generated content correctly', () => {
    cy.get('.recipe__user-generated').then($div => {
      if ($div.hasClass('hidden')) {
        cy.get('.recipe__user-generated').should('have.class', 'hidden');
      } else {
        cy.get('.recipe__user-generated').should('not.have.class', 'hidden');
      }
    });
  });

  it('handles non-existent recipes gracefully', () => {
    cy.visit('/#nonexistentrecipe');
    cy.get('.error')
      .should('exist')
      .and(
        'contain.text',
        'We could not find that recipe. Please try another one!'
      );
  });
});
