Feature: Google Search
  As a user
  I want to open Google and search
  So that I can find information

Scenario: Open Google homepage
  Given I am on the Google homepage
  When I wait for the page to load
  Then I should see the Google logo
  And I should see the search box
