describe('AddRecipeView', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234'); // Adjust the URL to the actual URL of your application
  });

  it('should open the add recipe window when clicking the add recipe button', () => {
    cy.get('.nav__btn--add-recipe').click();
    cy.get('.add-recipe-window').should('not.have.class', 'hidden');
    cy.get('.overlay').should('not.have.class', 'hidden');
  });

  it('should close the add recipe window when clicking the close button', () => {
    cy.get('.nav__btn--add-recipe').click();
    cy.get('.btn--close-modal').click();
    cy.get('.add-recipe-window').should('have.class', 'hidden');
    cy.get('.overlay').should('have.class', 'hidden');
  });

  it('should submit the form with valid data', () => {
    cy.get('.nav__btn--add-recipe').click();
    cy.get('.upload').within(() => {
      cy.get('input[name="title"]').type('Test Recipe');
      cy.get('input[name="sourceUrl"]').type('http://test.com');
      cy.get('input[name="image"]').type('http://test.com/image.jpg');
      cy.get('input[name="publisher"]').type('Test Publisher');
      cy.get('input[name="cookingTime"]').type('30');
      cy.get('input[name="servings"]').type('4');

      // Fill in ingredients
      cy.get('input[name="ingredient-1"]').type('0.5,kg,Rice');

      cy.get('button[type="submit"]').click();
    });

    // Ensure the success message is displayed
    cy.get('.message', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Recipe was successfully uploaded :)');
  });

  it('should handle toggling the add recipe window multiple times', () => {
    cy.get('.nav__btn--add-recipe').click();
    cy.get('.add-recipe-window').should('not.have.class', 'hidden');
    cy.get('.overlay').should('not.have.class', 'hidden');
    cy.get('.btn--close-modal').click();
    cy.get('.add-recipe-window').should('have.class', 'hidden');
    cy.get('.overlay').should('have.class', 'hidden');
    cy.get('.nav__btn--add-recipe').click();
    cy.get('.add-recipe-window').should('not.have.class', 'hidden');
    cy.get('.overlay').should('not.have.class', 'hidden');
  });
});
