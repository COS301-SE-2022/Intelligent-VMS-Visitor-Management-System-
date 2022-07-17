describe('Index', () => {
  it('should navigate to the login page when a user is not logged in', () => {

    // Start from the index page
    cy.visit('/');
    
    // Click the get started button
    cy.contains('Get Started').click();

    // Assert that URL is correct
    cy.url().should('include', '/login');
  });

})
