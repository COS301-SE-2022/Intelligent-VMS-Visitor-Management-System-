describe('Receptionist tests', () => {
    it('tests various receptionist functions', () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;

        describe('Navigate to Home page/confirm', () => {
            cy.visit('https://vms-client.vercel.app/');
            cy.contains('Go Beyond The Lobby');//confirm correct page
        })

        describe('Navigate to login page/confirm', () => {
            cy.get('.menuIcon').click();//misses it sometimes if it is not clicked twice
            // cy.wait(1000);
            cy.get('.menuIcon').click();//do not remove redundancy without running it a few times to test

            cy.contains('Login', { timeout: 7000 }).click({ force: true });
        })

        describe('Login as receptionist', () => {
            cy.url().should('include', 'login');//confirm correct page
            cy.get('input[name="email"]').type("receptionist@mail.com").should('have.value', 'receptionist@mail.com');
            cy.get('input[name="password"]').type("password").should('have.value', 'password');
            cy.get('.btn-primary ').click();
        })

        //========================Signed in as Receptionist=================================

        describe('confirm signed-in and  check for elements', () => {
            cy.location('pathname', { timeout: 60000 }).should('include', '/receptionistDashboard');//waiting for backend to wake up.
            cy.get('.menuIcon').click();
            cy.get('.dropdown-content').children().should('contain', 'Create Invite')//check for correct menu options.
                .and('contain', 'Your Dashboard')
                .and('contain', 'Your Profile')
                .and('contain', 'Manage Residents')
                .and('contain', 'Receptionist Dashboard')
                .and('contain', 'Logout');
            cy.get('.menuIcon').click();
            cy.contains('Your Dashboard').click({ force: true });
        })

        describe('Navigate to visitor dashboard/confirm navigation success', () => {
            cy.url().should('include', '/visitorDashboard');//confirm correct page
        })

        describe('Checking receptionist dashboard contents', () => {
            //checks for the relavant elements on the page
            cy.contains('Welcome back,');
            cy.contains('Total Number Of Invites Sent');
            cy.contains('Maximum Invites Allowed');
            cy.contains('Maximum Sleepovers');
            cy.contains('Visitor Curfew');
            cy.contains('Popular Visitors');
            cy.contains('Open invites', { matchCase: false });

            //check that the footer has rendered
            cy.contains('Team Firestorm').and('contain', 'Providing reliable tech since 2022');
        })

        describe('Confirm receptionist', () => {

        })

        describe('Navigate to receptionist invite user/confirm navigation success', () => {
            cy.get('.menuIcon').click();
            cy.contains('create invite', { matchCase: false }).click({ force: true });
            cy.url().should('include', '/createInvite');//confirm correct page
        })

        describe('Filling in a user invite', () => {
            cy.get('input[name="email"]').type('Stefan1234@mail.com').should('have.value', 'Stefan1234@mail.com');
            cy.get('input[name="idValue"]').type('9910304129088').should('have.value', '9910304129088');
            cy.get('input[name="name"]').type('Steffany').should('have.value', 'Steffany');
            cy.get('input[name="visitDate"]').type(today).should('have.value', today);
            cy.get('button[type="submit"]').click();
        })

        describe('checking that invite correctly displays on visitor dashboard', () => {
            cy.get('[class="card h-full bg-base-300 p-5"]', { timeout: 20000 })
                .children()
                .should('contain', 'Stefan1234@mail.com')
                .should('contain', '9910304129088')
                .should('contain', today)
                .should('contain', 'RSA-ID');
        })

        

        describe('receptionistDashboard/confirm navigation success', () => {
            cy.contains('Open Invites', { timeout: 8000 })
            cy.get('.menuIcon').click({ force: true });
            // cy.get('.menuIcon').click();
            cy.contains('Receptionist Dashboard', { matchCase: false }).click({ force: true });
            cy.url().should('include', '/receptionistDashboard');//confirm correct page
        })

        describe('confirming all elements have loaded for receptionist dashboard', () => {
            cy.contains('Today\'s Invites');
            cy.contains('Scan Invite');
            cy.contains('Bulk-SignIn');
        })
    })
})
