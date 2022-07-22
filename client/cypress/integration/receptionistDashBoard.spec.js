describe('My First Test', () => {
    it('Visits the Kitchen Sink', () => {
        //Navigate to Home page
        describe('Navigate to Home page/confirm', () => {
            cy.visit('https://vms-client.vercel.app/');
            cy.contains('Go Beyond The Lobby');//confirm correct page
         })

        //Navigate to login page
        describe('Navigate to login page/confirm', () => {
            
            cy.get('.menuIcon').click();//misses it sometimes if it is not clicked twice
            cy.get('.menuIcon').click();//do not remove redundancy without running it a few times to test
            cy.get('.menuIcon').click();
            cy.contains('Login', {timeout: 7000}).click();
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

            cy.get('.table-compact').children().should('contain','Email')//check for table/correct table headings.
            .and('contain','ID Document Type')
            .and('contain','ID Number')
            .and('contain','Date')
            .and('contain','Cancel Invite');

            //check that the footer has rendered
            cy.contains('Team Firestorm').and('contain','Providing reliable tech since 2022');
        })
       
        describe('Confirm receptionist', () => {

        })
            
        //uncomment the 5 lines of code below to have it download a pdf as well
        /*
        describe("will click the download button",()=>{
            cy.get('[download="Receptionist-weekly.png"]')
            .should('be.visible')
            .click()
        })*/

        describe('Navigate to receptionist invite user/confirm navigation success', () => {
            cy.get('.menuIcon').click();
            cy.contains('create invite', { matchCase: false }).click();
            cy.url().should('include', '/createInvite');//confirm correct page
        })


        describe('Filling in a user invite', () => {
            cy.get('input[name="email"]').type('Stefan1234@mail.com').should('have.value', 'Stefan1234@mail.com');
            cy.get('input[name="idValue"]').type('9910304129088').should('have.value', '9910304129088');
            cy.get('input[name="name"]').type('Steffany').should('have.value', 'Steffany');
            cy.get('input[name="visitDate"]').type('2022-07-30').should('have.value', '2022-07-30');
            cy.get('button[type="submit"]').click();
        })

        describe('checking that invite correctly displays on visitor dashboard', () => {
           cy.get('table[class="table-compact m-2 mb-5 table w-full md:table-normal"]', {timeout: 8000})
           .children()
           .should('contain','Stefan1234@mail.com')
           .should('contain','9910304129088')
           .should('contain','2022-07-30')
           .should('contain','RSA-ID');
        })

        describe('canceling invite', () => {
            cy.contains('td', 'Stefan1234@mail.com')//find stafans column
            .parent()//his row
            .within(($tr)=>{//search only within the row
                cy.get('td button').click()
            })  
         })

         

        //===============================ignore below...will implement it if we have time=====================
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
  