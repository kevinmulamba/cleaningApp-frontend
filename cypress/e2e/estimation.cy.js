describe("Test estimation rapide de prix", () => {
  it("devrait estimer un prix avec surface, niveau de saleté et options", () => {
    // 1. Aller sur la page de réservation
    cy.visit("http://localhost:3001/reservations");

    // 2. Entrer une surface
    cy.get('input[type="number"]').clear().type("20");

    // 3. Choisir un niveau de saleté (forcé si recouvert)
    cy.contains("Propre").click({ force: true });

    // 4. Choisir un niveau de service
    cy.contains("Standard").click({ force: true });

    // 5. Coche quelques options (avec force si nécessaire)
    cy.contains("animaux").click({ force: true });
    cy.contains("vitres").click({ force: true });

    // 6. Vérifie que le prix estimé est affiché
    cy.contains("Prix estimé").should("exist");
    cy.contains("Prestataire").should("exist");
    cy.contains("Plateforme").should("exist");

    // 7. Vérifie que le prix n'est pas 0.00
    cy.get("body")
      .should("contain.text", "$")
      .and("not.contain.text", "0.00");
  });
});

