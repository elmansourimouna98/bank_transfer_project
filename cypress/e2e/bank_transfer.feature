@transfer
Feature: Bank transfer creation

  As an authorized user
  I want to create a bank transfer
  So that payments can be processed


  @happy
  Scenario: Create an instant transfer successfully
    Given I am logged in as "Administrator"
    And I navigate to the transfer creation page
    When I fill the transfer form with valid data
    And I submit the form
    Then I should see a success confirmation


  @scheduled @date
  Scenario: Create a scheduled transfer for tomorrow
    Given I am logged in as "Administrator"
    And I navigate to the transfer creation page
    When I select "Scheduled" transfer mode
    And I choose tomorrow as transfer date
    And I fill the transfer form with valid data
    And I submit the form
    Then I should see a success confirmation


  @validation @iban
  Scenario: Reject transfer with invalid IBAN
    Given I am logged in as "Administrator"
    And I navigate to the transfer creation page
    When I fill the transfer form with:
      | beneficiaryName | John Doe      |
      | iban            | FR123         |
      | label           | RentPayment   |
      | amount          | 100           |
    And I submit the form
    Then I should see an IBAN validation error


  @rbac
  Scenario Outline: Unauthorized users cannot access transfer creation
    Given I am logged in as "<role>"
    When I navigate to the transfer creation page
    Then I should not be allowed to create a transfer

    Examples:
      | role    |
      | Viewer  |
      | Auditor |


  @rbac
  Scenario: Purchase Manager can create a transfer
    Given I am logged in as "PurchaseManager"
    And I navigate to the transfer creation page
    When I fill the transfer form with valid data
    And I submit the form
    Then I should see a success confirmation


  @boundary @amount
  Scenario: Transfer with minimum allowed amount
    Given I am logged in as "Administrator"
    And I navigate to the transfer creation page
    When I fill the transfer form with:
      | beneficiaryName | John Doe                     |
      | iban            | FR7630006000011234567890189 |
      | label           | Rent                         |
      | amount          | 0.01                         |
    And I submit the form
    Then I should see a success confirmation


  @boundary @amount
  Scenario: Reject transfer above maximum amount
    Given I am logged in as "Administrator"
    And I navigate to the transfer creation page
    When I fill the transfer form with:
      | beneficiaryName | John Doe                     |
      | iban            | FR7630006000011234567890189 |
      | label           | Rent                         |
      | amount          | 100000.01                    |
    And I submit the form
    Then I should see an amount validation error


  @validation @label
  Scenario: Reject label with special characters
    Given I am logged in as "Administrator"
    And I navigate to the transfer creation page
    When I fill the transfer form with:
      | beneficiaryName | John Doe                     |
      | iban            | FR7630006000011234567890189 |
      | label           | Rent!!!                      |
      | amount          | 100                          |
    And I submit the form
    Then I should see a label validation error