describe('R8UC1: Adding a todo to an added task', () => {
    let uid;
    let email;
    let taskId;
    let todoId;

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
                    todoId = res.body[0].todos[0]._id.$oid || res.body[0].todos[0]._id;
                });
            });
        });
});


    beforeEach(function () {
        // Navigate to main page and login
        cy.visit('http://localhost:3000');
        cy.contains('div', 'Email Address').find('input[type=text]').type(email);
        cy.get('form').submit();
        // Open existing task
        cy.contains('Football').click();
    });

    it('Adds a new todo when the input field is not empty.', () => {
        //Creating a new todo item
        cy.get('.inline-form input[type=text]').type('Test create new Todo Item');
        cy.get('.inline-form').submit();
        // Verify that the new todo item is displayed in the UI
        cy.get('.todo-list').should('contain.text', 'Test create new Todo Item');

        
        // Verify backend has stored the newly added todo item
        cy.request(`http://localhost:5000/tasks/byid/${taskId}`).then((res) => {
            const exists = res.body.todos.some(t => t.description === 'Test create new Todo Item');
            expect(exists).to.be.true;
        });
    });


   it('Toggles a todo item to "done" and verifies both UI strike-through and backend status update', () => {
        // Ensure backend state: set todo to "done = false" before testing
        cy.request({
            method: 'PUT',
            url: `http://localhost:5000/todos/byid/${todoId}`,
            body: `data={'$set': {'done': false}}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Simulate user toggling the todo in the UI
        cy.get('li.todo-item span.checker.unchecked').first().click();
        cy.get('li.todo-item span.checker.checked').first().should('exist');

        // Ensure the todo status was correctly updated in the backend (done == true)
        cy.request(`http://localhost:5000/tasks/byid/${taskId}`).then((res) => {
            const todo = res.body.todos.find(t => t._id.$oid === todoId || t._id === todoId);
            expect(todo.done).to.be.true;
        });
    });

    it('Toggles a todo item to "active" and verifies both UI strike-through and backend status update', () => {
        // Ensure backend state: set todo to "done = true" before testing
        cy.request({
            method: 'PUT',
            url: `http://localhost:5000/todos/byid/${todoId}`,
            body: `data={'$set': {'done': true}}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Simulate user toggling the todo in the UI
        cy.get('li.todo-item span.checker.checked').first().click();
        cy.get('li.todo-item span.checker.unchecked').first().should('exist');

        // Ensure the todo status was correctly updated in the backend (done == false)
        cy.request(`http://localhost:5000/tasks/byid/${taskId}`).then((res) => {
            const todo = res.body.todos.find(t => t._id.$oid === todoId || t._id === todoId);
            expect(todo.done).to.be.false;
        });
    });

    after(function () {
        cy.request({ method: 'DELETE', url: `http://localhost:5000/users/${uid}` });
    });
});
