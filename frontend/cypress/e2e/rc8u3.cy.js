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
                });
            });
    });

    beforeEach(function() {
        cy.visit('http://localhost:3000');
        cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email);
        cy.get('form')
            .submit();
        cy.contains('Football')
            .click();
    });

    it('R8UC3: Test to try removing the Real Madrid vs Bayern Munich todo item', () => {
        //Click the remover to delete the Real Madrid vs Bayern Munich todo-list item
        cy.contains('Real Madrid vs Bayern Munich').should('exist');
        cy.get('.todo-item:contains("Real Madrid vs Bayern Munich") .remover').click();
        cy.contains('Real Madrid vs Bayern Munich').should('not.exist');
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