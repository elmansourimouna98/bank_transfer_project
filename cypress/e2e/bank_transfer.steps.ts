import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

type TransferData = {
  beneficiaryName: string;
  iban: string;
  label: string;
  amount: string;
};

const selectors = {
  beneficiaryName: '[data-testid="beneficiary-name"]',
  iban: '[data-testid="iban"]',
  label: '[data-testid="label"]',
  amount: '[data-testid="amount"]',
  scheduledRadio: '[data-testid="transfer-mode-scheduled"]',
  transferDate: '[data-testid="transfer-date"]',
  submitButton: '[data-testid="submit-transfer"]',

  successMessage: '[data-testid="transfer-success"]',
  ibanError: '[data-testid="iban-error"]',
};

function tomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toISOString().split("T")[0];
}

function fillTransferForm(data: TransferData) {
  cy.get(selectors.beneficiaryName).type(data.beneficiaryName);
  cy.get(selectors.iban).type(data.iban);
  cy.get(selectors.label).type(data.label);
  cy.get(selectors.amount).type(data.amount);
}

Given("I am logged in as {string}", (role: string) => {
  cy.loginAs(role);
});

Given("I navigate to the transfer creation page", () => {
  cy.visit("/transfers/new");
});

When("I fill the transfer form with valid data", () => {
  fillTransferForm({
    beneficiaryName: "John Doe",
    iban: "FR7630006000011234567890189",
    label: "MonthlyRent",
    amount: "1500",
  });
});

When("I fill the transfer form with:", (table: any) => {
  const data = table.rowsHash();
  fillTransferForm(data);
});

When("I select {string} transfer mode", (mode: string) => {
  if (mode === "Scheduled") {
    cy.get(selectors.scheduledRadio).check();
  }
});

When("I choose tomorrow as transfer date", () => {
  cy.get(selectors.transferDate).type(tomorrowDate());
});

When("I submit the form", () => {
  cy.intercept("POST", "/api/transfers").as("createTransfer");

  cy.get(selectors.submitButton).click();

  cy.wait("@createTransfer")
    .its("response.statusCode")
    .should("eq", 201);
});

Then("I should see a success confirmation", () => {
  cy.get(selectors.successMessage)
    .should("be.visible")
    .and("contain", "Transfer created successfully");
});

Then("I should see an IBAN validation error", () => {
  cy.get(selectors.ibanError)
    .should("be.visible")
    .and("contain", "IBAN must contain between 14 and 34 characters");
});

Then("I should not be allowed to create a transfer", () => {
  cy.contains("Access denied").should("be.visible");
});

Then("I should see an amount validation error", () => {
  cy.contains("Amount must not exceed 100000")
    .should("be.visible");
});

Then("I should see a label validation error", () => {
  cy.contains("Label contains invalid characters")
    .should("be.visible");
});