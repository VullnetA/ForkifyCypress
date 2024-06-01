describe('Results View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('displays search results correctly', () => {
    // Perform a search
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();

    // Wait for the results to load and be visible
    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0
    );
  });

  it('displays spinner while loading results', () => {
    cy.intercept('GET', '**/recipes/?search=pizza**', req => {
      req.on('response', res => {
        res.setDelay(500); // Introduce a delay
      });
    }).as('searchResults');

    // Perform a search
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();

    // Check if the spinner is displayed
    cy.get('.spinner').should('be.visible');

    // Wait for the results
    cy.wait('@searchResults');

    // Check if the spinner is removed after results are loaded
    cy.get('.spinner').should('not.exist');
  });

  it('displays error message when no results are found', () => {
    cy.intercept('GET', '**/recipes/?search=nonexistent**', {
      body: { results: [] },
    }).as('searchNoResults');

    cy.get('.search__field').type('nonexistent');
    cy.get('.search').submit();

    cy.wait('@searchNoResults');
    cy.get('.error').should(
      'contain.text',
      'No recipes found for your query! Please try again ;)'
    );
  });

  it('renders initial pagination buttons', () => {
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();

    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.pagination').should('be.visible');
  });

  it('updates results view to mark selected search result', () => {
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();

    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link').first().click();

    cy.get('.preview__link--active').should('exist');
  });

  it('updates results when navigating with pagination', () => {
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();

    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.pagination__btn--next').click();

    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link').should('have.length.greaterThan', 0);
  });

  it('handles multiple searches consecutively', () => {
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();

    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link').should('have.length.greaterThan', 0);

    cy.get('.search__field').clear().type('pasta');
    cy.get('.search').submit();

    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link').should('have.length.greaterThan', 0);
  });

  it('verifies rendered content of search results', () => {
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();

    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link')
      .first()
      .within(() => {
        cy.get('.preview__title').should('contain.text', 'Pizza');
        cy.get('.preview__publisher').should('exist');
      });
  });
});
