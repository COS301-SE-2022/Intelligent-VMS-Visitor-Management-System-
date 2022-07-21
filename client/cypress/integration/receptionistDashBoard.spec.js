describe('My First Test', () => {
    it('Visits the Kitchen Sink', () => {
        //Navigate to Home page
        describe('Navigate to Home page/confirm', () => {
            cy.visit('https://vms-client.vercel.app/');
            cy.wait(500);
            cy.contains('Go Beyond The Lobby');//confirm correct page
         })

        //Navigate to login page
        describe('Navigate to login page/confirm', () => {
            cy.wait(500);
            cy.get('.menuIcon').click();
            cy.wait(500);
            cy.contains('Login').click();
        })

        //Login as receptionist
        describe('Login as receptionist', () => {
            cy.url().should('include', 'login');//confirm correct page
            cy.get('input[name="email"]').type("receptionist@mail.com" ).should('have.value', 'receptionist@mail.com');
            cy.get('input[name="password"]').type("password" ).should('have.value', 'password');
            cy.get('.btn-primary ').click();
        })

        //========================Signed in as Receptionist=================================
            
        describe('confirm signed-in and  check for elements', () => {
            cy.location('pathname', {timeout: 60000}).should('include', '/createInvite');//waiting for backend to wake up.
            cy.get('.menuIcon').click();
            cy.get('.dropdown-content').children().should('contain','Create Invite')//check for correct menu options.
            .and('contain','Your Dashboard')
            .and('contain','Manage Residents')
            .and('contain','Receptionist Dashboard')
            .and('contain','Logout');
            cy.get('.menuIcon').click();
            cy.contains('Your Dashboard').click();
        })
        
        //Checking visitor dashboard
        describe('Navigate to visitor dashboard/confirm', () => {
            cy.url().should('include', '/visitorDashboard');//confirm correct page
            cy.contains('Welcome back,Receptionist');
            cy.contains('User Invites');
            cy.contains('Total Number Of Invites Sent');
            cy.contains('Maximum Invites Allowed');
        })
            
        describe("will click the download button",()=>{
            cy.get('[download="Receptionist-weekly.png"]')
            .should('be.visible')
            .click()
        })
       
       //file download attempt
        // describe('file download', () => {
        //   //  it('verifies download', () => {
        //       cy.visit('/');
        //       cy.get('[download="Receptionist-weekly.png"]').click();
              
        //       const downloadsFolder = Cypress.config('downloadsFolder')
        //       const downloadedFilename = path.join(downloadsFolder, 'Receptionist-weekly.png')
              
        //       cy.readFile(downloadedFilename, 'binary', { timeout: 15000 })
        //       .should(buffer => expect(buffer.length).to.be.gt(100));
        //    // });
        //   });
            


        //code for conditional example
      /*cy.get('header').then(($a) => { 
        if ($a.text().includes('Account')) {
            cy.contains('Account')
            .click({force:true})
        } else if ($a.text().includes('Sign')) { 
            cy.contains('Sign In')
            .click({force:true})  
        } else {
            cy.get('.navUser-item--account .navUser-action').click({force:true})
        }
       
    }) */
      
    })
  })
  