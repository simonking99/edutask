describe('Logging into the system', () => {
    // define variables that we need on multiple occasions
    let uid // user id
    let name // name of the user (firstName + ' ' + lastName)
    let email // email of the user
  
    before(function () {
      // create a fabricated user from a fixture
      cy.fixture('user.json')
        .then((user) => {
          cy.request({
            method: 'POST',
            url: 'http://localhost:5000/users/create',
            form: true,
            body: user
          }).then((response) => {
            uid = response.body._id.$oid
            name = user.firstName + ' ' + user.lastName
            email = user.email
          })
        })
    })
  
  
    beforeEach(function () {
      cy.visit('http://localhost:3000');
      // enter the main main page
      // Check if user is already logged in
      cy.get('h1')
        .should('contain.text', 'Login')
  
      // detect a div which contains "Email Address", find the input and type (in a declarative way)
      cy.contains('div', 'Email Address')
        .find('input[type=text]')
        .type(email)
      // alternative, imperative way of detecting that input field
      //cy.get('.inputwrapper #email')
      //    .type(email)
  
      // submit the form on this page
      cy.get('form')
        .submit()
  
      // assert that the user is now logged in
      cy.get('h1')
        .should('contain.text', 'Your tasks, ' + name)
    })
  
  
    it('Creates a task', () => {
    // Write on the title field
    cy.get('#title').type('Football');
    // Write on the url field
    cy.get('#url').type('7cEpNIjMO7c');
    // Click on the create task button
    cy.contains('Create new Task').click();
    })
  
    it('Add a todo item with description', () => {
      //Click the img
      cy.get('img').click();
      //Write a new description for todo items
      cy.get('input[type="text"][placeholder="Add a new todo item"]')
      .type('Real Madrid');
      //Click on the Add submit button
      cy.get('input[type="submit"][value="Add"]').click();
      // Assert that the new todo item is added to the list
      cy.contains('Real Madrid').should('exist');
      })
  
    it('Set todo item to done', () => {
      cy.get('img').click();
      // Click on the todo item's checker
      cy.get('.todo-item:contains("Real Madrid") .checker').click();
    })
  
    it('Set todo item to activated', () => {
      cy.get('img').click();
      // Click on the todo item's checkere
      cy.get('.todo-item:contains("Real Madrid") .checker').click();
    })
  
    after(function () {
      // clean up by deleting the user from the database
      cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/users/${uid}`
      }).then((response) => {
        cy.log(response.body)
      })
    })
  })