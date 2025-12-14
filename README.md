<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/c7342728-a197-48ae-9f7e-64354e02b4eb" />
# FA08 - BDD Test Generator with Playwright

A powerful **Behavior Driven Development (BDD) test generator** that converts Gherkin-style feature files into executable **Playwright tests** running on **Microsoft Edge**.

## 📋 Features

✅ **BDD to Playwright Conversion** - Convert Given-When-Then scenarios to automated tests  
✅ **Generic Feature File Parser** - Reads all `.feature` files from `features/` folder  
✅ **Intelligent Step Mapping** - Automatically converts BDD steps to Playwright actions  
✅ **Microsoft Edge Testing** - Configured to run tests exclusively on Edge browser  
✅ **HTML Test Reports** - Beautiful reports with screenshots and execution details  
✅ **Multi-Scenario Support** - Generate tests from multiple scenarios per feature file  

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FA08

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 📖 Usage

### 1. Create a Feature File

Create a `.feature` file in the `features/` folder:

```bash
# features/google.feature
Feature: Google Search
  As a user
  I want to search on Google
  So that I can find information

Scenario: Open Google homepage
  Given I am on the Google homepage
  When I wait for the page to load
  Then I should see the search box

Scenario: Search for content
  Given I am on the Google homepage
  When I search "Playwright testing"
  Then I should see results
```

### 2. Generate Tests from BDD

```bash
# Process ALL feature files
node bdd-to-test.js

# Process specific feature file
node bdd-to-test.js google.feature
```

This generates:
- 📄 `tests/google.spec.js` - Executable Playwright test

### 3. Run Tests

```bash
# Run all tests
npm test

# Run with interactive UI
npm test:ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug
```

### 4. View Test Report

```bash
npx playwright show-report
```

Opens HTML test report in your browser with:
- ✅ Pass/Fail status
- 📸 Screenshots
- ⏱️ Execution time
- 📊 Test statistics

## 📁 Project Structure

```
FA08/
├── features/                      # BDD feature files (.feature)
│   ├── google.feature
│   └── login.feature
│
├── tests/                         # Generated & custom Playwright tests
│   ├── google.spec.js
│   ├── seed.spec.ts
│   └── login.feature.spec.js
│
├── playwright-report/             # HTML test reports
│   └── index.html
│
├── test-results/                  # Detailed test results
│
├── bdd-to-test.js                # BDD Generator script
├── index.js                       # Express server for testing
├── playwright.config.js           # Playwright configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🔄 BDD to Playwright Mapping

The generator automatically converts common BDD steps:

| BDD Step | Playwright Action |
|----------|-------------------|
| `Given I am on` | `page.goto()` |
| `When I enter email` | `page.fill('input[type="email"]')` |
| `When I click` | `page.click()` |
| `Then I should see` | `expect(page).toContainText()` |
| `And I wait` | `page.waitForLoadState()` |
| `When I search` | `page.fill()` + text input |

## 📝 Example: Google Search Test

### Feature File
```gherkin
Feature: Google Search Testing
  Scenario: Search on Google for Playwright
    Given I am on the Google homepage
    When I search "Playwright testing"
    Then I should see results
```

### Generated Test
```javascript
test('Search on Google for Playwright', async ({ page }) => {
  await page.goto('https://www.google.com/');
  await page.fill('textarea[name="q"]', 'Playwright testing');
  await page.press('textarea[name="q"]', 'Enter');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toContainText('Playwright');
});
```

## ⚙️ Configuration

### Playwright Config (`playwright.config.js`)

```javascript
// Tests run ONLY on Microsoft Edge
projects: [
  {
    name: 'Microsoft Edge',
    use: { ...devices['Desktop Edge'] },
  },
]
```

To add more browsers, modify `playwright.config.js`:
```javascript
projects: [
  {
    name: 'Microsoft Edge',
    use: { ...devices['Desktop Edge'] },
  },
  {
    name: 'Chromium',
    use: { ...devices['Desktop Chrome'] },
  },
]
```

## 🛠️ Available Commands

```bash
# Setup
npm install                    # Install dependencies
npx playwright install        # Install browsers

# Generate Tests
node bdd-to-test.js          # Process all features
node bdd-to-test.js google.feature  # Process specific feature

# Run Tests
npm test                       # Run all tests
npm test:ui                    # Interactive mode
npx playwright test --headed   # Show browser
npx playwright test --debug    # Debug mode

# Reports
npx playwright show-report     # View HTML report
```

## 📊 Test Report Features

- **Pass/Fail Summary** - Visual indicators for test results
- **Step Details** - Individual step execution information
- **Screenshots** - Visual proof of test execution
- **Video Recordings** - Full test execution video (configurable)
- **Execution Time** - Performance metrics
- **Test Logs** - Detailed console output

## 🔧 Troubleshooting

### Error: "Module not found"
```bash
npm install
```

### Error: "Browsers not installed"
```bash
npx playwright install
```

### Tests not generating
- Ensure feature files are in `features/` folder
- Check file extension is `.feature`
- Run: `node bdd-to-test.js`

### Test fails on execution
- Check application is running: `npm start`
- Verify URLs in feature files are correct
- Use `--debug` mode to inspect steps

## 📚 BDD Best Practices

1. **Use clear language** - Write scenarios anyone can understand
2. **One action per step** - Each Given/When/Then should do one thing
3. **Use correct keywords**:
   - `Given` - Setup/precondition
   - `When` - User action
   - `Then` - Expected result
   - `And` - Continue previous keyword

4. **Example scenarios**:
```gherkin
Scenario: User logs in successfully
  Given I am on the login page
  When I enter email "test@example.com"
  And I enter password "password123"
  And I click the login button
  Then I should see the dashboard
```

## 🤝 Contributing

1. Create feature files in `features/` folder
2. Run `node bdd-to-test.js`
3. Execute `npm test`
4. Review report in `playwright-report/`

## 📄 License

ISC

## �‍💻 Author

**Faiz-Ahmed08**

- GitHub: [@Faiz-Ahmed08](https://github.com/Faiz-Ahmed08)

## �📞 Support

For issues or questions:
1. Check the test report: `npx playwright show-report`
2. Run in debug mode: `npx playwright test --debug`
3. Review feature file syntax
4. Check application is running: `npm start`

---

**Happy Testing! 🎉**
