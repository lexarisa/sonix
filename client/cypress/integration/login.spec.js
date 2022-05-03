const chance = require('chance').Chance();
let mockUser;

describe('logs in user', () => {
  beforeEach(() => {
    //create mock credentials for each test
    mockUser = {
      firstName: chance.first(),
      lastName: chance.first(),
      handle: chance.first(),
      email: chance.email(),
      password: chance.string(),
      bio: chance.sentence(),
    };

    cy.visit('http://localhost:3000/login');
  });

  it('should navigate to dashboard if credentials are correct', () => {
    //create user in signup
    cy.visit('http://localhost:3000/signup');
    cy.get('[name="firstname"]').type(mockUser.firstName);
    cy.get('[name="lastname"]').type(mockUser.lastName);
    cy.get('[name="handle"]').type(mockUser.handle);
    cy.get('[type="email"]').type(mockUser.email);
    cy.get('[type="password"]').type(mockUser.password);
    cy.get('textarea').type(mockUser.bio);
    cy.get('.submit-btn').click();
    cy.location('pathname').should('eq', '/');
    cy.get(':nth-child(4) > .link').should('have.attr', 'href', '/').click(); //logout btn

    //sign up with those credentials
    cy.visit('http://localhost:3000/login');
    cy.get('[type="email"]').type(mockUser.email);
    cy.get('[type="password"]').type(mockUser.password);
    cy.get('.submit-btn').click();
    cy.location('pathname').should('eq', '/');
    cy.get(':nth-child(3) > .link').should('have.attr', 'href', '/me');
  });
  it('should not navigate to dashboard if credentials are incorrect', () => {
    cy.get('[type="email"]').type(mockUser.email);
    cy.get('[type="password"]').type('incorrectPassword');
    cy.get('.submit-btn').click();
    cy.location('pathname').should('include', '/login');
  });
  it('shows error message when credentials are incorrect', () => {
    cy.get('[type="email"]').type(mockUser.email);
    cy.get('[type="password"]').type('incorrectPassword');
    cy.get('.submit-btn').click();
    cy.get('.error-message').should('be.visible');
  });
});
