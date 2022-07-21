describe('Sign Up Page', () => {

    //Navigate to Home page
    describe('Navigate to Home page/confirm', () => {
        cy.visit('https://vms-client.vercel.app/');
        cy.wait(500);
        cy.contains('Go Beyond The Lobby');//confirm correct page
     })

    //Navigate to signup page
    describe('Navigate to login page/confirm', () => {
        cy.wait(500);
        cy.get('.menuIcon').click();
        cy.wait(500);
        cy.contains('Signup').click();
    })

    //Enter sign up info
    describe('Login as receptionist', () => {
        cy.url().should('include', 'signUp');//confirm correct page
        cy.get('input[name="email"]').type("u20573783@tuks.co.za" ).should('have.value', 'receptionist@mail.com');
        cy.get('input[name="name"]').type("Stefan" ).should('have.value', 'Stefan');
        cy.get('input[name="password"]').type("password" ).should('have.value', 'password');
        cy.get('.btn-primary ').click();
    })
    
})