describe('R8UC1: Adding a todo to an added task', () => {
    let uid;
    let email;

    before(function () {
        // Create a new user
        cy.fixture('user.json').then((user) => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:5000/users/create',
                form: true,
                body: user
            }).then((response) => {
                uid = response.body._id.$oid;
                email = user.email;

                // Create a new task with an Test todo item
                let data = {
                    title: "Football",
                    description: "Real Madrid vs Bayern Munich",
                    url: "7cEpNIjMO7c",
                    userid: uid,
                    todos: "Test todo"
                };

                cy.request({
                    method: 'POST',
                    url: 'http://localhost:5000/tasks/create',
                    form: true,
                    body: data
                });
            });
        });
    });

    beforeEach(function () {
        // Navigate to the main page and log in
        cy.visit('http://localhost:3000');
        cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email);
        cy.get('form').submit();
        cy.contains('Football').click();
    });

    it('Adds a new todo when the input field is not empty.', () => {
        cy.get('.inline-form input[type=text]').type('Test create new Todo Item');
        cy.get('.inline-form').submit();
        cy.get('.todo-list').should('contain.text', 'Test create new Todo Item');
    });

    it('Delete the second todo item by clicking on x', () => {
        cy.contains('li.todo-item', 'Test create new Todo Item')
            .find('.remover')
            .click()
            cy.contains('li.todo-item', 'Test create new Todo Item')
            .should('not.exist');
    });
    

    after(function () {
        // Clean up by deleting the user
        cy.request({
            method: 'DELETE',
            url: `http://localhost:5000/users/${uid}`
        }).then((response) => {
            cy.log(response.body);
        });
    });
});
