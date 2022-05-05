// import { useSelector } from 'react-redux';
// const loggedIn = useSelector((state) => state.authenticated);

// loggedIn
//   ?
describe('navbar non-auth', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:3000/');
  });
  it('displays the correct nav bar items', () => {
    
    cy.get('.nav-links > :nth-child(1) > .link').should(
      'have.class',
      'login-link'
    );
    cy.get('.nav-links > :nth-child(2) > .link').should(
      'have.class',
      'signup-link'
    );
    cy.get('.nav-links > :nth-child(3) > .link').should(
      'have.class',
      'search-link'
    );
  });
  it('login navigates to login page',()=>{
    cy.get('.nav-links > :nth-child(1) > .link').click();
    cy.location('pathname').should('include', '/login');

  });
  it('signup navigates to signup page',()=>{
    cy.get('.nav-links > :nth-child(2) > .link').click();
    cy.location('pathname').should('include', '/signup');

  });
  it('search navigates to search page',()=>{
    cy.get('.nav-links > :nth-child(3) > .link').click();
    cy.location('pathname').should('include', '/search');

  });
});

