#!/usr/bin/env node

/**
 * BDD to Playwright Test Generator
 * Converts BDD Given-When-Then format to Playwright test code
 * Reads all .feature files from features/ folder
 * 
 * Usage: 
 *   node bdd-to-test.js                    # Process all feature files
 *   node bdd-to-test.js filename.feature   # Process specific feature file
 */

const fs = require('fs');
const path = require('path');

const FEATURES_DIR = path.join(__dirname, 'features');
const TESTS_DIR = path.join(__dirname, 'tests');

// Ensure tests directory exists
if (!fs.existsSync(TESTS_DIR)) {
  fs.mkdirSync(TESTS_DIR, { recursive: true });
}

/**
 * Parse BDD feature file
 */
function parseFeatureFile(content) {
  const lines = content.split('\n');
  let feature = '';
  let description = '';
  const scenarios = [];
  let currentScenario = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('Feature:')) {
      feature = trimmed.replace('Feature:', '').trim();
    } else if (trimmed.startsWith('Scenario:')) {
      if (currentScenario) scenarios.push(currentScenario);
      currentScenario = {
        name: trimmed.replace('Scenario:', '').trim(),
        steps: []
      };
    } else if (currentScenario && (
      trimmed.startsWith('Given ') || 
      trimmed.startsWith('When ') || 
      trimmed.startsWith('Then ') || 
      trimmed.startsWith('And ') ||
      trimmed.startsWith('But ')
    )) {
      currentScenario.steps.push(trimmed);
    } else if (!feature && trimmed) {
      description += trimmed + ' ';
    }
  }

  if (currentScenario) scenarios.push(currentScenario);

  return { feature, description: description.trim(), scenarios };
}

/**
 * Convert BDD step to Playwright action
 */
function stepToPlaywright(step) {
  let code = `    // ${step}\n`;

  // Navigation
  if (step.match(/^Given I (?:am on|navigate to|open)/i)) {
    const match = step.match(/(?:am on|navigate to|open)[\s\w]+"?([^"]*)"?/i);
    const url = match ? match[1] : 'https://www.google.com/';
    code += `    await page.goto('${url}');\n`;
  }

  // Form filling - email
  else if (step.match(/enter.*email/i)) {
    const match = step.match(/"([^"]*)"/);
    const value = match ? match[1] : 'test@example.com';
    code += `    await page.fill('input[type="email"]', '${value}');\n`;
  }

  // Form filling - password
  else if (step.match(/enter.*password/i)) {
    const match = step.match(/"([^"]*)"/);
    const value = match ? match[1] : 'password123';
    code += `    await page.fill('input[type="password"]', '${value}');\n`;
  }

  // Form filling - generic text
  else if (step.match(/enter|fill.*(?:field|box|input)/i)) {
    const match = step.match(/"([^"]*)"/g);
    if (match && match.length >= 2) {
      const field = match[0].replace(/"/g, '');
      const value = match[1].replace(/"/g, '');
      code += `    await page.fill('input, textarea', '${value}');\n`;
    }
  }

  // Clicking buttons
  else if (step.match(/click|press/i)) {
    const match = step.match(/(?:click|press)\s+(?:the\s+)?(?:")?([^"]+)(?:")?/i);
    const button = match ? match[1].trim() : 'Submit';
    code += `    await page.click('button:has-text("${button}"), a:has-text("${button}")');\n`;
  }

  // Wait for elements
  else if (step.match(/wait/i)) {
    code += `    await page.waitForLoadState('networkidle');\n`;
  }

  // Assertions - see/contain text
  else if (step.match(/(?:should see|should contain|contains)/i)) {
    const match = step.match(/(?:see|contain)\s+(?:")?([^"]+)(?:")?/i);
    const text = match ? match[1] : 'expected text';
    code += `    await expect(page).toContainText('${text}');\n`;
  }

  // Assertions - visibility
  else if (step.match(/(?:should be visible|is visible|appears)/i)) {
    code += `    await expect(page.locator('visible=true')).toBeTruthy();\n`;
  }

  // Assertions - on page
  else if (step.match(/(?:should be on|should be at|am on)/i)) {
    code += `    await expect(page).toHaveURL(/.*/);\n`;
  }

  // Search/type
  else if (step.match(/search|type/i)) {
    const match = step.match(/"([^"]*)"/);
    const value = match ? match[1] : 'search term';
    code += `    await page.fill('input[name="q"], input[type="search"]', '${value}');\n`;
  }

  // Press key
  else if (step.match(/press enter|press key/i)) {
    code += `    await page.press('input, textarea', 'Enter');\n`;
  }

  // Default: comment only
  else {
    code += `    // TODO: Implement this step\n`;
  }

  code += '\n';
  return code;
}

/**
 * Generate Playwright test from parsed BDD
 */
function generateTest(feature, scenarios) {
  let testCode = `import { test, expect } from '@playwright/test';\n\n`;
  testCode += `test.describe('${feature}', () => {\n`;

  for (const scenario of scenarios) {
    testCode += `  test('${scenario.name}', async ({ page }) => {\n`;
    
    for (const step of scenario.steps) {
      testCode += stepToPlaywright(step);
    }

    testCode += `  });\n\n`;
  }

  testCode += `});\n`;
  return testCode;
}

/**
 * Get all feature files
 */
function getFeatureFiles(targetFile = null) {
  if (targetFile) {
    return [targetFile];
  }

  if (!fs.existsSync(FEATURES_DIR)) {
    console.log(`📁 Creating features directory...`);
    fs.mkdirSync(FEATURES_DIR, { recursive: true });
    return [];
  }

  return fs.readdirSync(FEATURES_DIR)
    .filter(f => f.endsWith('.feature'))
    .map(f => path.join(FEATURES_DIR, f));
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const targetFile = args[0] 
    ? path.join(FEATURES_DIR, args[0])
    : null;

  let files = getFeatureFiles(targetFile);

  if (files.length === 0) {
    console.log('⚠️  No .feature files found in features/ folder');
    console.log('📝 Create a feature file in features/ folder first:\n');
    console.log('  features/example.feature\n');
    return;
  }

  console.log(`\n📖 Processing ${files.length} feature file(s)...\n`);

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const { feature, scenarios } = parseFeatureFile(content);

      if (!feature || scenarios.length === 0) {
        console.log(`⚠️  No valid scenarios in ${path.basename(file)}`);
        continue;
      }

      const testCode = generateTest(feature, scenarios);
      const fileName = path.basename(file, '.feature');
      const testFile = path.join(TESTS_DIR, `${fileName}.spec.js`);

      fs.writeFileSync(testFile, testCode);

      console.log(`✅ ${path.basename(file)}`);
      console.log(`   └─ Generated: ${fileName}.spec.js`);
      console.log(`   └─ Scenarios: ${scenarios.length}`);
      console.log();

    } catch (error) {
      console.error(`❌ Error processing ${path.basename(file)}: ${error.message}`);
    }
  }

  console.log(`\n🚀 To run tests, execute:\n`);
  console.log(`   npm test\n`);
  console.log(`📊 To view test report:\n`);
  console.log(`   npx playwright show-report\n`);
}

main();

