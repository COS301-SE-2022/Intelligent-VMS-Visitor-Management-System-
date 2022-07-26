var myObj = { inText: 0,numberAllowed: 0,numberSent: 0 };
describe('Receptionist tests', () => {
    it('tests various administrator functions', () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today =yyyy + '-' + mm + '-' + dd ;

        describe('Navigate to Home page/confirm', () => {
            cy.visit('https://vms-client.vercel.app/');
            cy.contains('Go Beyond The Lobby');//confirm correct page
        })
    
        describe('Navigate to login page/confirm', () => {
            cy.get('.menuIcon').click();//misses it sometimes if it is not clicked twice
            cy.wait(1000);
            cy.get('.menuIcon').click();//do not remove redundancy without running it a few times to test
            cy.contains('Login', {timeout: 7000}).click();
        })

        describe('Login as administrator', () => {
            cy.url().should('include', 'login');//confirm correct page
            cy.get('input[name="email"]').type("admin@mail.com" ).should('have.value', 'admin@mail.com');
            cy.get('input[name="password"]').type("password" ).should('have.value', 'password');
            cy.get('.btn-primary ').click();
        })

        describe('confirm signed-in and  check for elements', () => {
            cy.location('pathname', {timeout: 60000}).should('include', '/createInvite');//waiting for backend to wake up.
            cy.get('.menuIcon').click();
            cy.get('.dropdown-content').children().should('contain','Create Invite')//check for correct menu options.
            .and('contain','Your Dashboard')
            .and('contain','Manage Users')
            .and('contain','Admin Dashboard')
            .and('contain','Logout');
            cy.get('.menuIcon').click();
        })
        
        describe('Filling in a user invite', () => {
            cy.get('input[name="email"]').type('Stefan1234@mail.com').should('have.value', 'Stefan1234@mail.com');
            cy.get('input[name="idValue"]').type('9910304129088').should('have.value', '9910304129088');
            cy.get('input[name="name"]').type('Steffany').should('have.value', 'Steffany');
            cy.get('input[name="visitDate"]').type(today).should('have.value', today);
            cy.get('button[type="submit"]').click();
        })
        // let inText = 0;
        // let numberAllowed= 0;
        // let numberSent= 0;
       

        describe('Checking max invites/radial percentage', () => {
            cy.location('pathname', {timeout: 60000}).should('include', '/visitorDashboard');//waiting for backend to wake up.
            cy.wait(2000)
         
            cy.contains('p', 'You are allowed to send ')      //find Stefans column
            .parent().then(($span) => {

                // $span is the object that the previous command yielded
                myObj.inText = $span.text();
                myObj.numberAllowed=myObj.inText.slice(-10, -9);
                myObj.numberSent= myObj.inText.slice(19, 20);
               
                
                cy.log(Math.trunc((myObj.numberSent/myObj.numberAllowed)*100));  
                cy.get('div[class="radial-progress text-base-content"]').within(($tr)=>{                        //search only within the row
                    cy.contains(Math.trunc((myObj.numberSent/myObj.numberAllowed)*100));
                })  
                cy.log(myObj.numberSent); 

                describe('canceling the personal invite', () => {
                    cy.contains('td', 'Stefan1234@mail.com')//find stafans column
                    .parent()                               //his row
                    .within(($tr)=>{                        //search only within the row
                        cy.get('td button').click()
                    })  
                })

                describe('confirming that the Invites sent has correctly updated', () => {
                    cy.wait(2000);//wait for page information to be updated
                    cy.contains('p', 'You are allowed to send ')      //find Stefans column
                        .parent().then(($span) => {
                            let myText = $span.text();
                            let newSent= myText.slice(19, 20);
                            if (newSent!=(myObj.numberSent-1)) {
                                throw new Error("Error, 'sent invites' value did not update correctly update after dismissing the invite");
                            }
                        })
                })
            })
           
        
        })
        describe('Navigate to admin dashboard/confirm navigation success', () => {
            cy.log('hmm');  
            cy.wait(6000);
            cy.get('.menuIcon').click();
            cy.contains('Admin Dashboard', { matchCase: false }).click();
            cy.url().should('include', '/adminDashboard');//confirm correct page
        })
        describe('set new visitor limit and confirm it correctly changes', () => {
            cy.wait(4000)
            // cy.get('p[ id="invPerRes"]').parent().then(($span) => {
            //     myObj.inText = $span.text();   
            //     cy.log(myObj.inText);
            // })

          
                       
        })

       

    })
})