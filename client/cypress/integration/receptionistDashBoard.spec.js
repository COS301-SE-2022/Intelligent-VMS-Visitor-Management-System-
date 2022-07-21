describe('My First Test', () => {
    it('Visits the Kitchen Sink', () => {
      cy.visit('https://vms-client.vercel.app/')
      cy.contains('Go Beyond The Lobby')//Login
      cy.get('.menuIcon').click();
      cy.wait(500);
      cy.contains('Login').click();
        cy.url().should('include', 'login')
      cy.get('input[name="email"]').type("receptionist@mail.com" ).should('have.value', 'receptionist@mail.com');
      cy.get('input[name="password"]').type("password" ).should('have.value', 'password')
    })
  })
  