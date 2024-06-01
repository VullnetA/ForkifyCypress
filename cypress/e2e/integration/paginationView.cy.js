describe('Pagination View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234'); // Update with the correct path to your application
  });

  const performSearch = query => {
    cy.get('.search__field').type(query);
    cy.get('.search').submit();
    cy.get('.results', { timeout: 10000 }).should('be.visible');
  };

  it('renders initial pagination buttons after a search', () => {
    performSearch('pizza');
    cy.get('.pagination').should('be.visible');
    cy.get('.pagination__btn--next').should('exist');
    cy.get('.pagination__btn--prev').should('not.exist');
  });

  it('renders only the next button on the first page when there are multiple pages', () => {
    performSearch('pizza');
    cy.get('.pagination__btn--next').should('exist');
    cy.get('.pagination__btn--prev').should('not.exist');
  });

  it('renders both next and previous buttons on middle pages', () => {
    performSearch('pizza');
    cy.get('.pagination__btn--next').click();
    cy.get('.pagination__btn--next').click();
    cy.get('.pagination__btn--prev').should('exist');
    cy.get('.pagination__btn--next').should('exist');
  });

  it('does not render any buttons when there is only one page', () => {
    performSearch('single result query'); // Replace with a query that returns a single page of results
    cy.get('.btn--inline').should('not.exist');
  });

  it('calls the handler with the correct page number when the next button is clicked', () => {
    performSearch('pizza');
    const handler = cy.spy().as('handler');
    cy.window().then(win => {
      win.paginationView.addHandlerClick(handler);
    });
    cy.get('.pagination__btn--next').click();
    cy.get('@handler').should('have.been.calledWith', 2);
  });

  it('calls the handler with the correct page number when the previous button is clicked', () => {
    performSearch('pizza');
    cy.get('.pagination__btn--next').click();
    const handler = cy.spy().as('handler');
    cy.window().then(win => {
      win.paginationView.addHandlerClick(handler);
    });
    cy.get('.pagination__btn--prev').click();
    cy.get('@handler').should('have.been.calledWith', 1);
  });

  it('does not call the handler if a non-button element is clicked', () => {
    performSearch('pizza');
    const handler = cy.spy().as('handler');
    cy.window().then(win => {
      win.paginationView.addHandlerClick(handler);
    });
    cy.get('.pagination').click();
    cy.get('@handler').should('not.have.been.called');
  });

  it('updates results when navigating with pagination', () => {
    performSearch('pizza');
    cy.get('.pagination__btn--next').click();
    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link').should('have.length.greaterThan', 0);
  });

  it('handles multiple searches consecutively with pagination', () => {
    performSearch('pizza');
    cy.get('.pagination__btn--next').click();
    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link').should('have.length.greaterThan', 0);

    cy.get('.search__field').clear().type('pasta');
    cy.get('.search').submit();

    cy.get('.results', { timeout: 10000 }).should('be.visible');
    cy.get('.preview__link').should('have.length.greaterThan', 0);
  });

  it('verifies rendered content of pagination buttons', () => {
    performSearch('pizza');
    cy.get('.pagination__btn--next').within(() => {
      cy.get('span').should('contain.text', 'Page 2');
      cy.get('svg').should('exist');
    });

    cy.get('.pagination__btn--next').click();
    cy.get('.pagination__btn--prev').within(() => {
      cy.get('span').should('contain.text', 'Page 1');
      cy.get('svg').should('exist');
    });
  });
});
