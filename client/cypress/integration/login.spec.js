describe("Login", () => {
    
  it('should navigate to the create invite page and set auth token when a user is logged in', () => {
    // Start from the index page
    cy.visit('/login')
    
    cy.get('input[placeholder="Email"]').type(Cypress.env("ADMIN_EMAIL"));

    cy.get('input[placeholder="Password"').type(Cypress.env("ADMIN_PASSWORD"));

    cy.get('button').click();

    cy.url().should("include", "/createInvite", () => {
        expect(localStorage.getItem("auth")).to.exist();
    });

  });

})
