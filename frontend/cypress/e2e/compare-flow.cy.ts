describe('Flujo de Scouting: Buscar, Seleccionar y Comparar', () => {

  beforeEach(() => {

    cy.visit('http://localhost:5173');


    cy.get('input[type="email"]').type('scout@test.com');
    cy.get('input[type="password"]').type('123456');

    cy.get('button').contains(/ingresar/i).click();


    cy.url().should('eq', 'http://localhost:5173/');

    cy.wait(1000);
  });

  it('debería buscar dos jugadores, agregarlos y verlos en el comparador', () => {

    cy.get('input[placeholder*="Buscar por nombre"]').type('Colidio');

    cy.wait(500);

    cy.contains('h2', 'Colidio')
      .parents('a')
      .parent()
      .find('button')
      .contains(/Comparar/i)
      .click();

    cy.contains('h2', 'Colidio')
      .parents('a').parent()
      .find('button')
      .should('contain.text', 'Quitar');



    cy.get('input[placeholder*="Buscar por nombre"]').clear().type('Herrera');
    cy.wait(500);

    cy.contains('h2', 'Herrera')
      .parents('a').parent()
      .find('button')
      .contains(/Comparar/i)
      .click();


    cy.contains(/Comparar|Ir a comparar/i).click();


    cy.url().should('include', '/compare');
    cy.contains('Colidio').should('be.visible');
    cy.contains('Herrera').should('be.visible');
  });

  it('debería deshabilitar el botón al intentar agregar un 4to jugador', () => {

    cy.get('button').contains(/Comparar/i).click();

    cy.get('button').contains(/Comparar/i).click();

    cy.get('button').contains(/Comparar/i).click();

    cy.get('button').contains(/Comparar/i).should('be.disabled');

  });

});