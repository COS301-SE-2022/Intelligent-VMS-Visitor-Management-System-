describe('Verify Page', () => {
    it('Visits the Kitchen Sink', () => {
        //Navigate to Home page
        describe('Navigate to Home page/confirm', () => {
            cy.visit('https://vms-client.vercel.app/');
            cy.wait(500);
        })

        //Navigate to signup page
        describe('Navigate to sign up page', () => {
            cy.wait(500);
            cy.get('.menuIcon').click();
            cy.wait(500);
            cy.contains('Signup').click();
        })

        //Enter sign up info
        describe('Sign up new user', () => {
            cy.get('input[name="email"]').type("MillionsAndMillionsOfDollars@mail.com").should('have.value', 'MillionsAndMillionsOfDollars@mail.com');
            cy.get('input[name="name"]').type("Stefan").should('have.value', 'Stefan');
            cy.get('input[name="password"]').type("P@ssword1").should('have.value', 'P@ssword1');
            cy.get('input[name="confirmPassword"]').type("P@ssword1").should('have.value', 'P@ssword1');
            cy.get('input[name="idNumber"]').type("0105085368078").should('have.value', '0105085368078');
            cy.get('input[name="userType"]').first().check();
            cy.get('.btn-primary ').click();
        })

        describe('confirm page movement', () => {
            cy.wait(1000);
            cy.url().should('include', 'verify');
            cy.contains('Please check your email to verify your account');//confirm correct page
            // cy.contains('RESEND EMAIL');//confirm correct page
            cy.get('.btn-primary ').should('be.visible');
        })

    })

})