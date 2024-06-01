describe('Bookmarks View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234'); // Update with the correct path to your application
  });

  const setBookmarks = bookmarks => {
    cy.window().then(win => {
      win.localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      win.location.reload();
    });
  };

  it('renders bookmarks on page load', () => {
    const bookmarks = [
      {
        id: '1',
        title: 'Recipe 1',
        publisher: 'Publisher 1',
        image: 'image1.jpg',
      },
      {
        id: '2',
        title: 'Recipe 2',
        publisher: 'Publisher 2',
        image: 'image2.jpg',
      },
    ];
    setBookmarks(bookmarks);

    cy.get('.bookmarks__list').children().should('have.length', 2);
    cy.get('.bookmarks__list').within(() => {
      cy.get('.preview__title').first().should('contain', 'Recipe 1');
      cy.get('.preview__title').last().should('contain', 'Recipe 2');
    });
  });

  it('renders bookmarks correctly', () => {
    const bookmarks = [
      {
        id: '1',
        title: 'Recipe 1',
        publisher: 'Publisher 1',
        image: 'image1.jpg',
      },
      {
        id: '2',
        title: 'Recipe 2',
        publisher: 'Publisher 2',
        image: 'image2.jpg',
      },
    ];
    setBookmarks(bookmarks);

    cy.get('.bookmarks__list').children().should('have.length', 2);
    cy.get('.bookmarks__list').within(() => {
      cy.get('.preview__title').first().should('contain', 'Recipe 1');
      cy.get('.preview__title').last().should('contain', 'Recipe 2');
      cy.get('.preview__publisher').first().should('contain', 'Publisher 1');
      cy.get('.preview__publisher').last().should('contain', 'Publisher 2');
    });
  });

  it('renders correct image for each bookmark', () => {
    const bookmarks = [
      {
        id: '1',
        title: 'Recipe 1',
        publisher: 'Publisher 1',
        image: 'image1.jpg',
      },
      {
        id: '2',
        title: 'Recipe 2',
        publisher: 'Publisher 2',
        image: 'image2.jpg',
      },
    ];
    setBookmarks(bookmarks);

    cy.get('.bookmarks__list').within(() => {
      cy.get('img').first().should('have.attr', 'src', 'image1.jpg');
      cy.get('img').last().should('have.attr', 'src', 'image2.jpg');
    });
  });

  it('maintains bookmarks between page reloads', () => {
    const bookmarks = [
      {
        id: '1',
        title: 'Recipe 1',
        publisher: 'Publisher 1',
        image: 'image1.jpg',
      },
    ];
    setBookmarks(bookmarks);

    cy.reload();

    cy.get('.bookmarks__list').children().should('have.length', 1);
    cy.get('.preview__title').first().should('contain', 'Recipe 1');
  });
});
