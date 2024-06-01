describe('Search View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234'); // Adjust the path to your application
  });

  it('should have a search input field', () => {
    cy.get('.search__field').should('exist').and('be.visible');
  });

  it('should allow the user to type a query in the search input field', () => {
    const query = 'Test Recipe';
    cy.get('.search__field').type(query).should('have.value', query);
  });

  it('should clear the input field after searching', () => {
    cy.get('.search__field').type('Test Recipe');
    cy.get('.search').submit();
    cy.get('.search__field').should('have.value', '');
  });

  it('should call the search handler on form submit', () => {
    cy.window().then(win => {
      const onSearchStub = cy.stub();

      // Replace the actual handler with the stub
      win.searchView.addHandlerSearch(onSearchStub);

      cy.get('.search__field').type('Test Recipe');
      cy.get('.search').submit();

      // Assert that the stub (handler) was called
      cy.wrap(onSearchStub).should('have.been.calledOnce');
    });
  });

  it('should clear the suggestions when the input is cleared', () => {
    cy.get('.search__field').type('Test');
    cy.get('.search__field').clear();
    cy.get('.search__suggestions').should('not.exist');
  });

  it('should submit the form when the enter key is pressed in the input field', () => {
    cy.get('.search__field').type('Test Recipe{enter}');
    // Add assertions to verify the form was submitted
  });

  it('should not allow special characters if restricted', () => {
    const restrictedQuery = '!@#$%';
    cy.get('.search__field').type(restrictedQuery);
    cy.get('.search__field').should('have.value', ''); // Ensure the input field is cleared
  });

  it('should show a loading spinner when a search is in progress', () => {
    cy.get('.search__field').type('Test Recipe');
    cy.get('.search').submit();

    // Assuming the spinner is inside the resultsView and has a class of .spinner
    cy.get('.spinner').should('exist').and('be.visible');
  });

  it('should remove the loading spinner when the search is complete', () => {
    cy.get('.search__field').type('Test Recipe');
    cy.get('.search').submit();
    // Simulate search completion
    cy.get('.search__spinner').should('not.exist');
  });
});
