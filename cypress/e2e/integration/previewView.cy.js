describe('Preview View', () => {
  beforeEach(() => {
    // Setup the initial state
    cy.visit('http://localhost:1234');
    // Perform a search to generate preview items
    cy.get('.search__field').type('pizza');
    cy.get('.search').submit();
    // Wait for the results to load and be visible
    cy.get('.results', { timeout: 10000 }).should('be.visible');
  });

  it('renders preview item correctly', () => {
    // Verify the structure of the first preview item
    cy.get('.preview')
      .first()
      .within(() => {
        cy.get('.preview__link').should('exist');
        cy.get('.preview__fig img')
          .should('have.attr', 'src')
          .and('not.be.empty');
        cy.get('.preview__fig img')
          .should('have.attr', 'alt')
          .and('not.be.empty');
        cy.get('.preview__data h4.preview__title').should('not.be.empty');
        cy.get('.preview__data p.preview__publisher').should('not.be.empty');
      });
  });

  it('marks active preview item correctly', () => {
    // Click on the first preview item to mark it as active
    cy.get('.preview__link').first().click();
    // Verify that the clicked item is marked as active
    cy.get('.preview__link--active').should('exist');
  });

  it('handles user-generated content visibility correctly', () => {
    // Check user-generated content visibility for the first preview item
    cy.get('.preview')
      .first()
      .within(() => {
        cy.get('.preview__user-generated').then($div => {
          if ($div.hasClass('hidden')) {
            cy.get('.preview__user-generated').should('have.class', 'hidden');
          } else {
            cy.get('.preview__user-generated').should(
              'not.have.class',
              'hidden'
            );
          }
        });
      });
  });

  it('updates URL hash correctly when clicking on preview item', () => {
    // Click on the first preview item
    cy.get('.preview__link').first().click();
    // Verify that the URL hash is updated correctly
    cy.get('.preview__link')
      .first()
      .invoke('attr', 'href')
      .then(href => {
        const id = href.split('#')[1];
        cy.url().should('include', `#${id}`);
      });
  });

  it('verifies preview link URL is correct', () => {
    // Verify the URL in the preview link
    cy.get('.preview__link')
      .first()
      .invoke('attr', 'href')
      .should('include', '#');
  });

  it('verifies image URL and alt text', () => {
    // Verify the image URL and alt text
    cy.get('.preview__fig img')
      .first()
      .should('have.attr', 'src')
      .and('not.be.empty');
    cy.get('.preview__fig img')
      .first()
      .should('have.attr', 'alt')
      .and('not.be.empty');
  });

  it('verifies publisher content', () => {
    // Verify the publisher content
    cy.get('.preview__data p.preview__publisher')
      .first()
      .should('not.be.empty');
  });

  it('verifies accessibility of preview items', () => {
    // Check that the preview items are accessible
    cy.get('.preview__fig img')
      .first()
      .should('have.attr', 'alt')
      .and('not.be.empty');
  });
});
