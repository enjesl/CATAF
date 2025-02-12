import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './TestSuites',
  timeout: 540000,
  workers: 1, // Use only one worker
  // Reporter configuration
  reporter: [
    ['html', { open: 'never' }],  // Generate HTML reports, 'never' means do not auto-open
    ['json', { outputFile: 'test-results/results.json' }],  // Save JSON reports
    ['junit', { outputFile: 'test-results/results.xml' }],  // Optional: Save JUnit-style XML report
    ['allure-playwright', {
      outputFolder: 'allure-results', // Where to save the results
      suiteTitle: true,                // Add suite title in the report
    }]
  ],
  use: {
    browserName: 'chromium',
    headless: false,
    launchOptions: {
      args: ['--incognito'] 
    },
    contextOptions: {
      // This option ensures no cookies, local storage, or session data is carried over
      ignoreHTTPSErrors: true, // Option to ignore HTTPS errors
      storageState: undefined, // Don't use saved storage state (clears cookies and localStorage)
    },
    baseURL: '#',  
    viewport: { width: 1280, height: 720 },
    screenshot: 'on',  // Capture screenshot on every step
    trace: 'on',  // Capture trace for debugging
  },
});
