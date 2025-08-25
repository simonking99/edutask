describe('R8UC1: Adding a todo to an added task', () => {
    let uid;
    let email;
    let taskId;

    before(function () {
        // Creating a new user and logging in
        cy.fixture('user.json').then((user) => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:5000/users/create',
                form: true,
                body: user
            }).then((response) => {
                uid = response.body._id.$oid;
                email = user.email;

                // Create a task with a todo item
                const data = {
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
                }).then((res) => {
                    taskId = res.body[0]._id.$oid || res.body[0]._id;
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

    it('Delete the pre created todo item by clicking on x', () => {
        cy.contains('li.todo-item', 'Test todo').find('.remover').click()
        // Verify that the todo item no longer exists in the UI
        cy.contains('li.todo-item', 'Test todo').should('not.exist');
        
        // Verify that the todo item is also removed from the backend
        cy.request(`http://localhost:5000/tasks/byid/${taskId}`).then((res) => {
            console.log(res.body)
            const exists = res.body.todos.some(t => t.description === 'Test todo');
            expect(exists).to.be.false;
        });
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
