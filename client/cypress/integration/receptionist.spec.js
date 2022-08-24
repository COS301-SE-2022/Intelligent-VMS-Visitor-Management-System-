/*describe('Receptionist tests', () => {
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
            cy.contains('Welcome back,Receptionist');
            cy.contains('User Invites');
            cy.contains('Total Number Of Invites Sent');
            cy.contains('Maximum Invites Allowed');
            cy.contains('Open invites', { matchCase: false });

            //check for table/correct table headings.
            cy.get('.table-compact').children().should('contain', 'Email')
                .and('contain', 'ID Document Type')
                .and('contain', 'ID Number')
                .and('contain', 'Date')
                .and('contain', 'Cancel Invite');

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
            cy.get('table[class="table-compact m-2 mb-5 table w-full md:table-normal"]', { timeout: 8000 })
                .children()
                .should('contain', 'Stefan1234@mail.com')
                .should('contain', '9910304129088')
                .should('contain', today)
                .should('contain', 'RSA-ID');
        })

        describe('canceling a personal invite', () => {
            cy.contains('td', 'Stefan1234@mail.com')//find stafans column
                .parent()                               //his row
                .within(($tr) => {                        //search only within the row
                    cy.get('td button').click()
                })
        })

        describe('Navigate to receptionist invite user/confirm navigation success', () => {
            cy.get('.menuIcon').click();
            cy.contains('create invite', { matchCase: false }).click();
            cy.url().should('include', '/createInvite');//confirm correct page
        })

        describe('Filling in a user invite', () => {
            cy.get('input[name="email"]').type('Stefan1234@mail.com').should('have.value', 'Stefan1234@mail.com');
            cy.get('input[name="idValue"]').type('9910304129088').should('have.value', '9910304129088');
            cy.get('input[name="name"]').type('Steffany').should('have.value', 'Steffany');
            cy.get('input[name="visitDate"]').type(today).should('have.value', today);
            cy.get('button[type="submit"]').click();
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
            cy.contains('Scan to Search');
            cy.contains('Bulk-SignIn');
            cy.contains('Scan to Search');
            cy.get('table[class="mb-5 table w-full"]')//Confirm table has loaded
                .children()
                .should('contain', 'Visitor Name')
                .should('contain', 'Visitor ID')
                .should('contain', 'Status')
        })

        describe('sign in a visitor', () => {
            cy.contains('td', '9910304129088')      //find Stefans column
                .parent()                               //his row
                .within(($tr) => {                        //search only within the row
                    cy.get('td label').click()
                })
            cy.contains('Confirm sign-in of visitor with id');

            cy.get('div[class="modal-box"]').within(($div) => {
                cy.contains('Sign in').click();
            });
        })
        
        describe('sign out the visitor that was just signed in', () => {

            cy.wait(4000);
            cy.contains('td', '9910304129088')      //find Stefans column
                .parent()                               //his row
                .within(($tr) => {                        //search only within the row
                    cy.get('td label').click()
                })
            cy.get('div[class="modal-box"]').within(($div) => {
                cy.contains('Sign out').click();
            });
        })
    })
})*/
