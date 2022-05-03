const chance = require('chance').Chance();

define('', () => {
  beforeEach('', () => {
    cy.visit('http://localhost:3000/signup');
  });

  it('requires all input fields', () => {
    cy.get('[name="firstname"]').type(chance.first());
    cy.get('[name="lastname"]').type(chance.last());
    cy.get('[name="handle"]').type(chance.first());
    cy.get('[type="email"]').type(chance.email());
    // -- missing password --
    cy.get('textarea').type(chance.sentence());
    cy.get('.submit-btn').click();
    cy.location('pathname').should('contain', '/signup');
  });
  it('navigates to dashboard if signed up and has profile link', () => {
    cy.get('[name="firstname"]').type(chance.first());
    cy.get('[name="lastname"]').type(chance.last());
    cy.get('[name="handle"]').type(chance.first());
    cy.get('[type="email"]').type(chance.email());
    cy.get('[type="password"]').type(chance.string());
    cy.get('textarea').type(chance.sentence());
    cy.get('.submit-btn').click();
    cy.location('pathname').should('eq', '/');
    cy.get(':nth-child(3) > .link').should('have.attr', 'href', '/me');
  });
});
