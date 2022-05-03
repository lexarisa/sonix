describe('Create New Recipe Form Tests', () => {
  it('opens the create new recipe form and fills in the form', () => {
    cy.visit('http://localhost:3000/create');
    cy.get('title').type('Title of Recipe');
    cy.get('description').type('Description of Recipe');
    cy.get('originalSynth').type('Test original synth');
  });
});

//description
//originalSynth

//select name category
//input tags.0.value

//button
