describe("Admin Dashboard", () => {
    
  it('Setting the number of invites of the residents to zero prevents any invites from being created', () => {
    // Start from the index page
    cy.visit('/login')
    
    cy.get('input[placeholder="Email"]').type(Cypress.env("ADMIN_EMAIL"));

    cy.get('input[placeholder="Password"').type(Cypress.env("ADMIN_PASSWORD"));

    cy.get('button').click();

    cy.url().should("include", "/createInvite");

    cy.get(".dropdown").click();

    cy.get(".dropdown ul a[href*='/adminDashboard']").click();

    cy.url().should("include", "/createInvite");

    cy.get('[data-testid="increaseInvites"]').click();

    cy.contains("Save Changes").click();

  });

})

