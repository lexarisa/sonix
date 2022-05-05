const chance = require('chance').Chance();

describe('navbar auth', () => {
  before(() => {
    //create user in signup
    cy.visit('http://localhost:3000/signup');
    cy.get('[name="firstname"]').type(chance.first());
    cy.get('[name="lastname"]').type(chance.last());
    cy.get('[name="handle"]').type(chance.string());
    cy.get('[type="email"]').type(chance.email());
    cy.get('[type="password"]').type(chance.string());
    cy.get('textarea').type(chance.sentence());
    cy.get('.submit-btn').click();
    cy.location('pathname').should('eq', '/');
  });

  it('displays the correct nav bar items', () => {
    cy.get('.nav-links > :nth-child(1) > .link').should(
      'have.class',
      'create-link'
    );
    cy.get('.nav-links > :nth-child(2) > .link').should(
      'have.class',
      'search-link'
    );
    cy.get('.nav-links > :nth-child(3) > .link').should(
      'have.class',
      'profile-link'
    );
    cy.get('.nav-links > :nth-child(4) > .link').should(
      'have.class',
      'logout-link'
    );
  });
  it('create navigates to create page', () => {
    cy.get('.nav-links > :nth-child(1) > .link').click();
    cy.location('pathname').should('include', '/create');
    cy.go('back');
  });
  it('search navigates to search page', () => {
    cy.get('.nav-links > :nth-child(2) > .link').click();
    cy.location('pathname').should('include', '/search');
    cy.go('back');
  });
  it('profile navigates to profile page', () => {
    cy.get('.nav-links > :nth-child(3) > .link').click();
    cy.location('pathname').should('include', '/me');
    cy.go('back');
  });
  it('triggers logout', () => {
    cy.get('.nav-links > :nth-child(4) > .link').click();
    cy.location('pathname').should('eq', '/');
  });
});
