Cypress.Commands.add("loginAs", (role: string) => {
  cy.session(role, () => {
    cy.visit("/login");

    cy.get('[data-testid="email"]').type(
      `${role.toLowerCase()}@test.com`
    );

    cy.get('[data-testid="password"]').type("Password123");

    cy.get('[data-testid="login-button"]').click();

    cy.url().should("include", "/dashboard");
  });
});

Cypress.Commands.add("createTransfer", (data) => {
  cy.get('[data-testid="beneficiary-name"]')
    .type(data.beneficiaryName);

  cy.get('[data-testid="iban"]')
    .type(data.iban);

  cy.get('[data-testid="label"]')
    .type(data.label);

  cy.get('[data-testid="amount"]')
    .type(data.amount);
});