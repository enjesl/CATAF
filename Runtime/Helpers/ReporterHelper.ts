import { Page, test } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Helper function to capture a screenshot and attach to Allure report
export async function captureScreenshot(page: Page, action: string, testInfo: any) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '_');  
  const screenshotPath = path.resolve(__dirname, `../../Reports/screenshots/${action}_${timestamp}.png`); // Adjusted path

  // Ensure screenshots folder exists inside the Reports folder
  const screenshotsDir = path.dirname(screenshotPath);
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Capture screenshot
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot captured: ${screenshotPath}`);

  // Attach screenshot to the Allure report
  testInfo.attachments.push({
    name: `Screenshot - ${action}`,
    path: screenshotPath,
    contentType: 'image/png',
  });
}
