describe('Adding a todo to an added task. .', () => {
    let uid
    let name
    let email
    before(function() {

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

                    cy.visit('http://localhost:3000')

                    cy.contains('div', 'Email Address')
                        .find('input[type=text]')
                        .type(email)
                    cy.get('form')
                        .submit()

                    cy.get('.inputwrapper #title')
                        .type("Football")
                    cy.get('.inputwrapper #url')
                        .type("7cEpNIjMO7c")
                    cy.get('form')
                        .submit()
                })
            })

    })

    beforeEach(function() {
        //Enter main page and follow with logging in to the account.
        cy.visit('http://localhost:3000')
        cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email)
        cy.get('form')
            .submit()
        cy.contains('Football')
            .click()
    })

    it('R8UC1: Test to try adding a todo item', () => {
        cy.get('.inline-form')
            .find('input[type=text]')
            .type("Real Madrid vs Bayern Munich")
        cy.get('.inline-form').submit()

        cy.get('.todo-list')
            .should('contain.text', 'Real Madrid vs Bayern Munich')
    })

    it('R8UC1: Test to check if add button is disabled when description field is empty', () => {
        cy.get('.inline-form')
            .find('input[type="text"]')
            .clear();
        cy.get('.inline-form')
            .find('input[type="submit"]')
            .should('be.disabled');
        });


after(function () {
    cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
        cy.log(response.body)
    })
    })
})
