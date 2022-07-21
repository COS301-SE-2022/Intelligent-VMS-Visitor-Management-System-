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
    
})