describe('Adding a todo to an added task.', () => {
    let uid; // user id
    let name; // name of the user (firstName + ' ' + lastName)
    let email; // email of the user

    // This block runs once before all tests
    before(function() {
        cy.fixture('user.json')
            .then((user) => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:5000/users/create',
                    form: true,
                    body: user
                }).then((response) => {
                    uid = response.body._id.$oid;
                    name = user.firstName + ' ' + user.lastName;
                    email = user.email;

                    cy.visit('http://localhost:3000');

                    cy.contains('div', 'Email Address')
                        .find('input[type=text]')
                        .type(email);
                    cy.get('form')
                        .submit();

                    cy.get('.inputwrapper #title')
                        .type("Football");
                    cy.get('.inputwrapper #url')
                        .type("7cEpNIjMO7c");
                    cy.get('form')
                        .submit();

                    cy.contains('Football')
                        .click();
    
                    cy.get('.inline-form')
                        .find('input[type=text]')
                        .type("Real Madrid vs Bayern Munich");
                    cy.get('.inline-form').submit();

                    cy.get('.inline-form')
                        .find('input[type=text]')
                        .type("test");
                    cy.get('.inline-form').submit();

                    // Mark "Real Madrid vs Bayern Munich" as done
                    cy.contains('.todo-item', 'Real Madrid vs Bayern Munich')
                        .find('.checker.unchecked')
                        .click();
                });
            });
    });

    // This block runs before each test
    beforeEach(function() {
        // Enter main page and log in to the account without creating new todos
        cy.visit('http://localhost:3000');
        cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email);
        cy.get('form')
            .submit();
        cy.contains('Football')
            .click();
    });

    it('R8UC2: Test to se if the Real Madrid vs Bayern Munich todo item is marked as done, then toggled to active', () => {
        //Assert that the checker has the 'checked' class for the Real Madrid vs Bayern Munich todo item
        cy.contains('.todo-item', 'Real Madrid vs Bayern Munich').find('.checker').should('have.class', 'checked')
    
        //Assert that the text is struck through
        cy.contains('.todo-item', 'Real Madrid vs Bayern Munich').find('.editable').should('have.css', 'text-decoration-line', 'line-through')
    
        //Click the checker to mark the item as active
        cy.contains('.todo-item', 'Real Madrid vs Bayern Munich').find('.checker.checked').click()
    
        //Assert that the checker has the 'unchecked' class
        cy.contains('.todo-item', 'Real Madrid vs Bayern Munich').find('.checker').should('not.have.class', 'checked')
    
        //Assert that the text is no longer struck through
        cy.contains('.todo-item', 'Real Madrid vs Bayern Munich').find('.editable').should('not.have.css', 'text-decoration-line', 'line-through')
    })

    it('R8UC2: Test to se if the test todo item is marked as active, then toggled to done', () => {
        //Assert that the checker has the 'unchecked' class for the test todo item
        cy.contains('.todo-item', 'test').find('.checker').should('have.class', 'unchecked')
    
        //Assert that the text is not struck through
        cy.contains('.todo-item', 'test').find('.editable').should('not.have.css', 'text-decoration-line', 'line-through')
    
        //Click the checker to mark the item as done
        cy.contains('.todo-item', 'test').find('.checker.unchecked').click()
    
        //Assert that the checker has the 'checked' class
        cy.contains('.todo-item', 'test').find('.checker').should('have.class', 'checked')
    
        // Assert that the text is struck through
        cy.contains('.todo-item', 'test').find('.editable').should('have.css', 'text-decoration-line', 'line-through')
    })

    after(function () {
        cy.request({
            method: 'DELETE',
            url: `http://localhost:5000/users/${uid}`
        }).then((response) => {
            cy.log(response.body);
        });
    });
});
