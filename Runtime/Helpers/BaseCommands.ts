import { Page, test, expect, Frame } from '@playwright/test';
import { locators } from './LocatorHelper';  
import { captureScreenshot } from './ReporterHelper';  
import { DataHelper } from './DataHelper'; 
import { getCurrentTimestamp } from './TimeHelper'
import * as path from 'path';
import * as fs from 'fs';


// Dynamically resolve the path to config.json
const configPath = path.resolve(__dirname, '../../config.json');
let config: any;

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (error: unknown) {
  if (error instanceof Error) {
    // If the error is an instance of Error, use its properties
    throw new Error(`Error reading config.json at ${configPath}: ${error.message}`);
  } else {
    // Handle other types of errors (e.g., strings, objects, etc.)
    throw new Error(`Unknown error reading config.json at ${configPath}`);
  }
}

// Now use the config
console.log('Config loaded successfully:', config);
// Helper function to resolve locators dynamically
export const resolveLocator = (locatorKey: string, locators: any): string => {
  // If the locator is a direct XPath string (i.e., it doesn't contain a dot, it's not a page locator key)
  if (!locatorKey.includes('.')) {
    return locatorKey; // It's already a complete locator, no need for further resolution
  }

  // If it's in the format of 'PageName.LocatorName' (e.g., PG_Login.input_countrydropdown)
  const [pageName, locator] = locatorKey.split('.');  
  const locatorValue = locators[`${pageName}_Locators`]?.[locator]; // Get the locator from the locators object

  if (!locatorValue) {
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  return locatorValue; // Return the resolved locator
};




export class BaseCommandCaller {
  
// Method to fill input fields dynamically with scroll and screenshot on failure
static async fill(page: Page, locatorKey: string, value: string, capture: boolean = false) {
  // *** Start of Fill Command *** [Date: 2024-11-25 10:30:00]
  /*
    ********************************************
    ** Command: Fill Input Field **
    ** Action: Filling field with value: "John Doe" **
    ** Locator: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // Mark the test as failed and capture screenshot
    test.fail(true, `Locator for ${locatorKey} not found.`); // Fail the test explicitly
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  // Log the start of the action and execute the step
  try {
    await test.step(`Fill the ${locatorKey} with value: ${value}`, async () => {
      const locator = page.locator(locatorValue);

      // Scroll to the locator before interacting
      await locator.evaluate((element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      });

      // Fill the field
      await locator.fill(value);

      // Attach the filled value to the report as an attachment
      test.info().attachments.push({
        name: `Filled Value for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(value), // Attach the value filled into the input field
      });

      // Capture and attach screenshot for this step if the capture flag is true
      if (capture) {
        await captureScreenshot(page, `fill_${locatorKey}`, test.info());
      }
    });
  } catch (error: unknown) {
    // Catch error and handle it
    if (error instanceof Error) {
      // Log the error message and capture screenshot
      console.error(`Test failed with error: ${error.message}`);
      await captureScreenshot(page, `fill_${locatorKey}_failure`, test.info());

      // Mark the test as failed with the error message
      test.fail(true, `Test failed with error: ${error.message}`); // Explicitly fail the test
      throw error; // Re-throw the error to fail the test
    } else {
      // If the error is not an instance of Error, log it as unknown
      console.error(`Test failed with unknown error: ${error}`);
      await captureScreenshot(page, `fill_${locatorKey}_failure`, test.info());

      // Fail the test if an unknown error occurs
      test.fail(true, 'Unknown error occurred during the test');
      throw new Error('Unknown error occurred'); // Re-throw the error
    }
  }
  // *** End of Fill Command *** [Date: 2024-11-25 10:31:00]
}



// Method to click on elements dynamically with screenshot on failure
static async click(
  page: Page,
  locatorKey: string,
  capture: boolean = false
): Promise<void> {
  // Resolve the locator value
  const locatorValue = resolveLocator(locatorKey, locators);

  // Fail the test if the locator is not found
  if (!locatorValue) {
    const errorMessage = `Locator not found for key: "${locatorKey}".`;
    console.error(errorMessage);
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  try {
    await test.step(`Click the element "${locatorKey}"`, async () => {
      const elementHandle = page.locator(locatorValue);

      // Check if the element exists
      const elementCount = await elementHandle.count();
      if (elementCount === 0) {
        const errorMessage = `Element with locator "${locatorKey}" not found on the page.`;
        console.error(errorMessage);

        // Capture screenshot on failure
        if (capture) {
          await captureScreenshot(page, `missing_element_${locatorKey}_failure`, test.info());
        }

        // Fail the test explicitly
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }

      // Wait for the element to be visible and enabled
      await elementHandle.waitFor({ state: 'visible', timeout: 5000 });

      // Scroll into view if necessary
      await elementHandle.scrollIntoViewIfNeeded();

      // Click the element
      await elementHandle.click();

      console.log(`Clicked on element "${locatorKey}" successfully.`);

      // Capture screenshot after a successful click if capture is true
      if (capture) {
        await captureScreenshot(page, `click_${locatorKey}`, test.info());
      }
    });
  } catch (error: unknown) {
    // Handle errors during the click action
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred during click action.';
    console.error(`Test failed with error: ${errorMessage}`);

    // Capture screenshot on failure
    if (capture) {
      await captureScreenshot(page, `click_${locatorKey}_failure`, test.info());
    }

    // Fail the test and re-throw the error
    test.fail(true, `Test failed with error: ${errorMessage}`);
    throw error instanceof Error ? error : new Error(errorMessage);
  }
}



  

  // Capture screenshot when a step fails and save it to a 'failed' folder with 'fail_' prefix
  static async attachScreenshotOnFailure(page: Page, action: string, testInfo: any) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
    const screenshotPath = path.resolve(__dirname, `../../Reports/screenshots/failed/${action}_fail_${timestamp}.png`);  // Save under 'failed' folder with 'fail_' prefix

    // Ensure the 'failed' folder exists inside the 'screenshots' folder
    const screenshotsDir = path.dirname(screenshotPath);
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Capture screenshot on failure
    await page.screenshot({ path: screenshotPath });

    // Attach the screenshot to the Allure report
    testInfo.attachments.push({
      name: `${action} - Failed Screenshot`,
      contentType: 'image/png',
      path: screenshotPath,
    });
  }

// Generic method to get text content dynamically with screenshot on failure
static async getTextContent(page: Page, locatorKey: string, capture: boolean = false): Promise<string | null> {
  /*
    ********************************************
    ** Command: Get Text Content **
    ** Action: Fetch content from element: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // If the locator is not found, fail the test and capture a screenshot
    test.fail(true, `Locator for ${locatorKey} not found.`);
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  try {
    return await test.step(`Fetch text content from ${locatorKey}`, async () => {
      // Ensure the element is visible before fetching the text content
      await page.locator(locatorValue).waitFor({ state: 'visible' });

      // Fetch the text content
      const text = await page.locator(locatorValue).textContent();

      // Attach the fetched text to the report
      test.info().attachments.push({
        name: `Text Content for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(text || 'No content available'), // Handle null content gracefully
      });

      // Capture screenshot after fetching text content if capture flag is true
      if (capture) {
        await captureScreenshot(page, `getTextContent_${locatorKey}`, test.info());
      }

      console.log(`Fetched text content for ${locatorKey}: ${text?.trim()}`);
      return text?.trim() || null; // Return trimmed text content or null
    });
  } catch (error: unknown) {
    // Handle errors
    if (error instanceof Error) {
      console.error(`Test failed with error: ${error.message}`);
      await captureScreenshot(page, `getTextContent_${locatorKey}_failure`, test.info());

      // Attach error details to the report
      test.info().attachments.push({
        name: `Get Text Content Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Error occurred: ${error.message}`),
      });

      // Fail the test and rethrow the error
      test.fail(true, `Test failed with error: ${error.message}`);
      throw error;
    } else {
      console.error(`Test failed with unknown error: ${error}`);
      await captureScreenshot(page, `getTextContent_${locatorKey}_unknown_failure`, test.info());

      // Attach unknown error details to the report
      test.info().attachments.push({
        name: `Get Text Content Unknown Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from('Unknown error occurred during the text fetch operation'),
      });

      // Fail the test and throw a generic error
      test.fail(true, 'Unknown error occurred');
      throw new Error('Unknown error occurred');
    }
  }
}


// Generic method to perform "Enter" action dynamically with screenshot on failure
static async enter(page: Page, locatorKey: string, capture: boolean = false) {
  /*
    ********************************************
    ** Command: Enter Key Action **
    ** Action: Press "Enter" on element: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // If the locator is not found, fail the test and capture a screenshot
    test.fail(true, `Locator for ${locatorKey} not found.`);
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  try {
    // Perform the "Enter" action
    await test.step(`Press "Enter" key on ${locatorKey}`, async () => {
      const locator = page.locator(locatorValue);

      // Ensure the element is visible before pressing "Enter"
      await locator.waitFor({ state: 'visible' });

      // Perform the "Enter" action
      await locator.press('Enter');

      // Attach a success message to the report
      test.info().attachments.push({
        name: `Enter Key Action for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Successfully pressed "Enter" on ${locatorKey}`),
      });

      // Capture screenshot after performing the "Enter" action if capture flag is true
      if (capture) {
        await captureScreenshot(page, `enter_${locatorKey}_success`, test.info());
      }
    });
  } catch (error: unknown) {
    // Handle errors
    if (error instanceof Error) {
      console.error(`Test failed with error: ${error.message}`);

      // Capture screenshot and attach it to the report on failure
      await captureScreenshot(page, `enter_${locatorKey}_failure`, test.info());
      test.info().attachments.push({
        name: `Enter Key Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Test failed during "Enter" action on ${locatorKey}: ${error.message}`),
      });

      // Re-throw the error to fail the test
      test.fail(true, `Test failed with error: ${error.message}`);
      throw error;
    } else {
      console.error(`Test failed with unknown error: ${error}`);

      // Capture screenshot and attach unknown error details
      await captureScreenshot(page, `enter_${locatorKey}_unknown_failure`, test.info());
      test.info().attachments.push({
        name: `Enter Key Unknown Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Unknown error occurred during "Enter" action on ${locatorKey}`),
      });

      // Fail the test and throw a generic error
      test.fail(true, 'Unknown error occurred');
      throw new Error('Unknown error occurred');
    }
  }
}


// Generic method to perform "Tab" action dynamically with screenshot on failure
static async tab(page: Page, locatorKey: string, capture: boolean = false) {
  /*
    ********************************************
    ** Command: Tab Key Action **
    ** Action: Press "Tab" on element: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // If the locator is not found, fail the test and capture a screenshot
    test.fail(true, `Locator for ${locatorKey} not found.`);
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  try {
    // Perform the "Tab" action
    await test.step(`Perform "Tab" key action on ${locatorKey}`, async () => {
      // Ensure the element is visible before pressing "Tab"
      const locator = page.locator(locatorValue);
      await locator.waitFor({ state: 'visible' });

      // Press the "Tab" key
      await locator.press('Tab');

      // Attach a success message to the report
      test.info().attachments.push({
        name: `Tab Key Action for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Successfully pressed "Tab" on ${locatorKey}`),
      });

      // Capture screenshot after performing the "Tab" action if `capture` flag is true
      if (capture) {
        await captureScreenshot(page, `tab_${locatorKey}_success`, test.info());
      }
    });
  } catch (error: unknown) {
    // Handle errors
    if (error instanceof Error) {
      console.error(`Test failed with error: ${error.message}`);

      // Attach error message and screenshot to the report
      await captureScreenshot(page, `tab_${locatorKey}_failure`, test.info());
      test.info().attachments.push({
        name: `Tab Key Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Test failed during "Tab" action on ${locatorKey}: ${error.message}`),
      });

      // Mark the test as failed and rethrow the error
      test.fail(true, `Test failed with error: ${error.message}`);
      throw error;
    } else {
      console.error(`Test failed with unknown error: ${error}`);

      // Attach unknown error message and screenshot to the report
      await captureScreenshot(page, `tab_${locatorKey}_unknown_failure`, test.info());
      test.info().attachments.push({
        name: `Tab Key Unknown Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Unknown error occurred during "Tab" action on ${locatorKey}`),
      });

      // Mark the test as failed and throw a generic error
      test.fail(true, 'Unknown error occurred');
      throw new Error('Unknown error occurred');
    }
  }
}


// Generic method to perform "Arrow Down" action dynamically with screenshot on failure
static async arrowDown(page: Page, locatorKey: string, capture: boolean = false) {
  /*
    ********************************************
    ** Command: Arrow Down Key Action **
    ** Action: Press "ArrowDown" on element: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // If the locator is not found, fail the test and capture a screenshot
    test.fail(true, `Locator for ${locatorKey} not found.`);
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  try {
    // Perform the "Arrow Down" action
    await test.step(`Perform "Arrow Down" action on ${locatorKey}`, async () => {
      // Ensure the element is visible before performing the action
      const locator = page.locator(locatorValue);
      await locator.waitFor({ state: 'visible' });

      // Press the "ArrowDown" key
      await locator.press('ArrowDown');

      // Attach a success message to the report
      test.info().attachments.push({
        name: `Arrow Down Action for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Successfully performed "Arrow Down" action on ${locatorKey}`),
      });

      // Capture a screenshot after performing the action if `capture` flag is true
      if (capture) {
        await captureScreenshot(page, `arrowDown_${locatorKey}_success`, test.info());
      }
    });
  } catch (error: unknown) {
    // Handle known and unknown errors
    if (error instanceof Error) {
      console.error(`Test failed with error: ${error.message}`);

      // Attach error message and screenshot to the report
      await captureScreenshot(page, `arrowDown_${locatorKey}_failure`, test.info());
      test.info().attachments.push({
        name: `Arrow Down Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Test failed during "Arrow Down" action on ${locatorKey}: ${error.message}`),
      });

      // Mark the test as failed and rethrow the error
      test.fail(true, `Test failed with error: ${error.message}`);
      throw error;
    } else {
      console.error(`Test failed with unknown error: ${error}`);

      // Attach unknown error message and screenshot to the report
      await captureScreenshot(page, `arrowDown_${locatorKey}_unknown_failure`, test.info());
      test.info().attachments.push({
        name: `Arrow Down Unknown Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Unknown error occurred during "Arrow Down" action on ${locatorKey}`),
      });

      // Mark the test as failed and throw a generic error
      test.fail(true, 'Unknown error occurred');
      throw new Error('Unknown error occurred');
    }
  }
}


static async realClick(
  page: Page,
  locatorKey: string,
  capture: boolean = false,
  options?: { force?: boolean; position?: { x: number; y: number } }
) {
  /*
    ********************************************
    ** Command: Real Click Action **
    ** Action: Click on element: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // Mark the test as failed and attach the error message to the report
    test.fail(true, `Locator for ${locatorKey} not found.`);
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  try {
    await test.step(`Performing real click on ${locatorKey}`, async () => {
      // Perform the click action with optional parameters
      await page.locator(locatorValue).click({
        force: options?.force ?? true, // Force the click even if the element is not interactable
        position: options?.position,  // Specify position if provided
      });

      // Attach success message to the report
      test.info().attachments.push({
        name: `Real Click Success for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Real click action performed successfully on ${locatorKey}`),
      });

      // Capture screenshot if the `capture` flag is true
      if (capture) {
        await captureScreenshot(page, `realClick_${locatorKey}_success`, test.info());
      }
    });
  } catch (error: unknown) {
    // Handle known and unknown errors
    if (error instanceof Error) {
      console.error(`Test failed with error: ${error.message}`);

      // Attach error message and screenshot to the report
      await captureScreenshot(page, `realClick_${locatorKey}_failure`, test.info());
      test.info().attachments.push({
        name: `Real Click Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Test failed during real click action on ${locatorKey}: ${error.message}`),
      });

      // Mark the test as failed and rethrow the error
      test.fail(true, `Test failed with error: ${error.message}`);
      throw error;
    } else {
      console.error(`Test failed with unknown error: ${error}`);
      
      // Attach unknown error message and screenshot to the report
      await captureScreenshot(page, `realClick_${locatorKey}_unknown_failure`, test.info());
      test.info().attachments.push({
        name: `Real Click Unknown Failure for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Unknown error occurred during real click action on ${locatorKey}`),
      });

      // Mark the test as failed and throw a generic error
      test.fail(true, 'Unknown error occurred');
      throw new Error('Unknown error occurred');
    }
  }
}


 
// Soft Assertion Handler to manage assertion behavior
static async handleAssertionFailure(
  page: Page,
  action: string,
  testInfo: any,
  isSoft: boolean = false
) {
  if (isSoft) {
    // Soft assertion: Log failure and continue execution
    console.error(`Soft Assertion Failed: ${action}`);
    await this.attachScreenshotOnFailure(page, action, testInfo);
    // Log the error but continue with the next steps
    return; 
  } else {
    // Hard assertion: Log failure and stop execution
    console.error(`Hard Assertion Failed: ${action}`);
    await this.attachScreenshotOnFailure(page, action, testInfo);
    // Throw an error to fail the test immediately
    throw new Error(`Hard Assertion Failed: ${action}`);
  }
}




static async isLocatorPresent(
  page: Page,
  locatorKey: string,
  timeout: number = 5000,
  assertionMode: 'soft' | 'hard' = 'hard',
  retries: number = 3
): Promise<boolean> {
  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    const errorMessage = `Locator not found for key: "${locatorKey}".`;
    console.error(`[ERROR] ${errorMessage}`);

    // Attach error details to the test report
    test.info().attachments.push({
      name: `Error - Locator Not Found`,
      contentType: 'text/plain',
      body: Buffer.from(errorMessage),
    });

    if (assertionMode === 'hard') {
      // Explicitly mark the test case as failed
      test.fail(true,`Locator not found: ${locatorKey}`);
      throw new Error(`Test Case Failed: ${errorMessage}`);
    }

    console.warn(`[WARN] ${errorMessage}`);
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await test.step(`Attempt ${attempt}/${retries}: Checking presence of locator "${locatorKey}"`, async () => {
        console.log(`[INFO] Attempt ${attempt}/${retries}: Checking visibility of "${locatorKey}"`);

        // Wait for the locator to become visible
        await page.locator(locatorValue).waitFor({ state: 'visible', timeout });

        console.log(`[INFO] Locator "${locatorKey}" is visible on the page.`);
      });

      return true; // Locator found
    } catch (error) {
      console.warn(`[WARN] Attempt ${attempt}/${retries} failed: Locator "${locatorKey}" is not visible.`);
      if (attempt === retries) {
        const finalErrorMessage = `Locator "${locatorKey}" is not visible after ${retries} retries.`;

        // Attach final failure details
        test.info().attachments.push({
          name: `Error - Locator Not Visible`,
          contentType: 'text/plain',
          body: Buffer.from(finalErrorMessage),
        });

        if (assertionMode === 'soft') {
          console.warn(`[WARN] Soft assertion: ${finalErrorMessage}`);
          return false;
        } else {
          // Explicitly fail the test case in hard mode
          test.fail(true,`Locator not visible: ${locatorKey}`);
          throw new Error(`Test Case Failed: ${finalErrorMessage}`);
        }
      }
    }
  }

  return false; // Should not reach here in hard mode
}








// Method to check if text is present on the page with dynamic wait
static async isTextPresent(
  page: Page,
  text: string,
  timeout: number = 5000,
  assertionMode: 'soft' | 'hard' = 'hard' // Soft or hard assertion
): Promise<boolean> {
  // *** Start of Text Presence Check Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Text Presence Check **
    ** Action: Check if text "${text}" is present
    ********************************************
  */

  try {
    await test.step(`Check if text "${text}" is present on the page`, async () => {
      // Wait for the text to be visible on the page
      await page.locator(`text=${text}`).waitFor({ state: 'visible', timeout: timeout });

      // Attach the success message to the report
      test.info().attachments.push({
        name: `Text Presence Success`,
        contentType: 'text/plain',
        body: Buffer.from(`Text "${text}" is present on the page.`),
      });

      console.log(`Text "${text}" is present on the page.`);
    });

    return true; // Return true if text is found
  } catch (error: unknown) {
    // Log error and handle soft or hard assertions
    await test.step(`Handle failure for text presence: "${text}"`, async () => {
      if (error instanceof Error) {
        console.error(`Text presence check failed with error: ${error.message}`);

        // Capture and attach screenshot for failure
        await captureScreenshot(page, `text_present_${text}_failure`, test.info());

        if (assertionMode === 'soft') {
          console.warn(`Soft assertion failed: Text "${text}" is not present.`);
          return false; // Continue execution for soft assertion
        } else {
          // For hard assertions, mark the test as failed
          test.fail(true, `Hard assertion failed: Text "${text}" is not present.`);
          throw error; // Re-throw error to fail the test
        }
      } else {
        // Log unknown errors and handle accordingly
        console.error(`Unknown error occurred while checking text: "${text}"`);
        await captureScreenshot(page, `text_present_${text}_unknown_error`, test.info());
        test.fail(true, `Unknown error occurred while checking text: "${text}"`);
        throw new Error('Unknown error occurred.');
      }
    });

    return false; // Return false for soft assertion failures
  }
  // *** End of Text Presence Check Command *** [Date: ${new Date().toISOString()}]
}




// Method to select an option from a dropdown dynamically with screenshot on failure
static async selectOption(
  page: Page,
  locatorKey: string,
  value: string,
  capture: boolean = false
): Promise<void> {
  // *** Start of Select Option Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Select Option **
    ** Action: Select value "${value}" from "${locatorKey}"
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // Mark the test as failed and capture screenshot if locator is not found
    if (capture) {
      await captureScreenshot(page, `selectOption_${locatorKey}_not_found`, test.info());
    }
    test.fail(true, `Locator for ${locatorKey} not found.`);
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  try {
    // Log the step and perform the select action
    await test.step(`Select option for ${locatorKey} with value: ${value}`, async () => {
      const dropdownLocator = page.locator(locatorValue);

      // Ensure dropdown is visible before interaction
      await dropdownLocator.waitFor({ state: 'visible' });

      // Select the desired option
      await dropdownLocator.selectOption(value);

      // Attach the selected value to the report as an attachment
      test.info().attachments.push({
        name: `Selected Value for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Selected Value: ${value}`), // Attach the selected value
      });

      console.log(`Successfully selected value: "${value}" for ${locatorKey}`);

      // Capture screenshot after performing the select action if capture flag is true
      if (capture) {
        await captureScreenshot(page, `selectOption_${locatorKey}_success`, test.info());
      }
    });
  } catch (error: unknown) {
    // Handle errors and log appropriately
    await test.step(`Handle failure for selecting option in ${locatorKey}`, async () => {
      if (error instanceof Error) {
        console.error(`Test failed with error: ${error.message}`);
        if (capture) {
          await captureScreenshot(page, `selectOption_${locatorKey}_failure`, test.info());
        }
        test.fail(true, `Test failed with error: ${error.message}`);
        throw error; // Re-throw the error to fail the test
      } else {
        console.error(`Test failed with unknown error.`);
        if (capture) {
          await captureScreenshot(page, `selectOption_${locatorKey}_unknown_error`, test.info());
        }
        test.fail(true, `Unknown error occurred during selectOption for ${locatorKey}`);
        throw new Error('Unknown error occurred.');
      }
    });
  }

  // *** End of Select Option Command *** [Date: ${new Date().toISOString()}]
}



// Method to assert visibility of a button with screenshot on failure
static async assertButtonVisibility(
  page: Page,
  locatorKey: string,
  wait: number = 5000,
  capture: boolean = false
): Promise<void> {
  // *** Start of Assert Button Visibility Command *** [Date: ${new Date().toISOString()}]
  /*
    ***********************************************
    ** Command: Assert Button Visibility **
    ** Action: Wait for the button "${locatorKey}" to be visible within ${wait} ms
    ***********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // If the locator is not found, mark the test as failed and capture the screenshot
    if (capture) {
      await captureScreenshot(page, `assertButtonVisibility_${locatorKey}_not_found`, test.info());
    }
    test.fail(true, `Locator for ${locatorKey} not found.`);
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  try {
    // Log the step and perform the visibility check
    await test.step(`Assert visibility of ${locatorKey}`, async () => {
      await page.locator(locatorValue).waitFor({ state: 'visible', timeout: wait });

      // Attach a message confirming the visibility to the report
      test.info().attachments.push({
        name: `Visibility Assertion for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Button ${locatorKey} is visible within ${wait} ms.`),
      });

      // Capture screenshot if capture flag is true
      if (capture) {
        await captureScreenshot(page, `assertButtonVisibility_${locatorKey}_success`, test.info());
      }
      console.log(`Button ${locatorKey} is visible.`);
    });
  } catch (error: unknown) {
    // If there's an error (element not visible), capture the screenshot and attach it
    await test.step(`Handle failure for visibility assertion of ${locatorKey}`, async () => {
      if (error instanceof Error) {
        console.error(`Test failed: ${error.message}`);
        if (capture) {
          await captureScreenshot(page, `assertButtonVisibility_${locatorKey}_failure`, test.info());
        }
        test.fail(true, `Button ${locatorKey} visibility assertion failed: ${error.message}`);
        throw error;
      } else {
        console.error(`Test failed with unknown error.`);
        if (capture) {
          await captureScreenshot(page, `assertButtonVisibility_${locatorKey}_unknown_error`, test.info());
        }
        test.fail(true, `Unknown error occurred while asserting visibility for ${locatorKey}`);
        throw new Error('Unknown error occurred.');
      }
    });
  }

  // *** End of Assert Button Visibility Command *** [Date: ${new Date().toISOString()}]
}



// Method to capture a screenshot with a title and attach it to the test report
static async captureScreenshotWithTitle(page: Page, title: string): Promise<void> {
  // *** Start of Capture Screenshot Command *** [Date: ${new Date().toISOString()}]
  /*
    ***********************************************
    ** Command: Capture Screenshot with Title **
    ** Action: Capture screenshot with title "${title}"
    ***********************************************
  */

  try {
    await test.step(`Capture screenshot: ${title}`, async () => {
      // Capture the screenshot as a buffer
      const screenshotBuffer = await page.screenshot();

      // Attach the screenshot to the test report with the given title
      test.info().attachments.push({
        name: title,
        contentType: 'image/png',
        body: screenshotBuffer, // Attach the screenshot as a PNG image
      });

      // Log successful screenshot capture
      console.log(`Screenshot successfully captured with title: ${title}`);
    });
  } catch (error: unknown) {
    await test.step(`Handle screenshot capture failure for: ${title}`, async () => {
      if (error instanceof Error) {
        console.error(`Error capturing screenshot with title: ${title}.`, error.message);

        // Mark the test as failed explicitly with a clear error message
        test.fail(true, `Error capturing screenshot with title: ${title}. ${error.message}`);
      } else {
        console.error(`Unknown error occurred while capturing screenshot with title: ${title}`);
        test.fail(true, `Unknown error occurred while capturing screenshot with title: ${title}`);
      }
      throw error; // Re-throw the error to propagate failure
    });
  }
  // *** End of Capture Screenshot Command *** [Date: ${new Date().toISOString()}]
}


// Method to assert that text on the page matches a given value dynamically with screenshot on failure
static async assertTextMatch(
  page: Page,
  locatorKey: string,
  expectedText: string,
  capture: boolean = false
): Promise<void> {
  // *** Start of Assert Text Match Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Assert Text Match **
    ** Action: Assert text matches expected value: "${expectedText}" on locator: "${locatorKey}" **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    await test.step(`Fail - Locator not found: ${locatorKey}`, async () => {
      if (capture) {
        await captureScreenshot(page, `assertTextMatch_${locatorKey}_not_found`, test.info());
      }
      console.error(`Locator for ${locatorKey} not found.`);
      test.fail(true, `Locator for ${locatorKey} not found.`);
    });
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  // Log the start of the action
  await test.step(`Assert text on ${locatorKey} matches "${expectedText}"`, async () => {
    try {
      // Step: Retrieve text content
      const actualText = await test.step(`Retrieve text from ${locatorKey}`, async () => {
        return await page.locator(locatorValue).textContent();
      });

      // Step: Trim and compare the text
      const trimmedActualText = actualText?.trim() ?? '';
      const trimmedExpectedText = expectedText.trim();

      await test.step(`Compare actual text with expected text`, async () => {
        if (trimmedActualText !== trimmedExpectedText) {
          throw new Error(
            `Text mismatch. Expected: "${trimmedExpectedText}", Actual: "${trimmedActualText}"`
          );
        }
        console.log(`Assertion passed. Text on ${locatorKey} matches "${expectedText}"`);
      });

      // Attach text comparison details to the report
      test.info().attachments.push({
        name: `Text Assertion Details for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Expected: "${trimmedExpectedText}", Actual: "${trimmedActualText}"`),
      });

      // Capture and attach screenshot for this step if the capture flag is true
      if (capture) {
        await captureScreenshot(page, `assertTextMatch_${locatorKey}_success`, test.info());
      }
    } catch (error: unknown) {
      await test.step(`Handle failure for text assertion`, async () => {
        if (error instanceof Error) {
          console.error(`Test failed with error: ${error.message}`);
          if (capture) {
            await captureScreenshot(page, `assertTextMatch_${locatorKey}_failure`, test.info());
          }
          test.fail(true, `Text assertion failed: ${error.message}`);
          throw error;
        } else {
          console.error(`Unknown error occurred during text assertion on ${locatorKey}`);
          if (capture) {
            await captureScreenshot(page, `assertTextMatch_${locatorKey}_unknown_failure`, test.info());
          }
          test.fail(true, 'Unknown error occurred during text assertion');
          throw new Error('Unknown error occurred during text assertion');
        }
      });
    }
  });
  // *** End of Assert Text Match Command *** [Date: ${new Date().toISOString()}]
}


// Method to perform recovery click (click if element is visible, otherwise proceed)
static async recoveryClick(
  page: Page,
  locatorKey: string,
  capture: boolean = false
): Promise<void> {
  // *** Start of Recovery Click Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Recovery Click Element **
    ** Action: Click element if visible: ${locatorKey}
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    await test.step(`Fail - Locator not found: ${locatorKey}`, async () => {
      if (capture) {
        await captureScreenshot(page, `recoveryClick_${locatorKey}_not_found`, test.info());
      }
      console.error(`Locator for ${locatorKey} not found.`);
      test.fail(true, `Locator for ${locatorKey} not found.`);
    });
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  // Log the start of the recovery click action
  await test.step(`Perform recovery click on ${locatorKey}`, async () => {
    try {
      // Check visibility and click if visible
      await test.step(`Check visibility of ${locatorKey}`, async () => {
        const isElementVisible = await page.locator(locatorValue).isVisible();
        if (isElementVisible) {
          console.log(`${locatorKey} is visible. Proceeding to click.`);
          await test.step(`Click ${locatorKey}`, async () => {
            await page.locator(locatorValue).click();

            // Optional screenshot after click
            if (capture) {
              await captureScreenshot(page, `recoveryClick_${locatorKey}_clicked`, test.info());
            }
          });
        } else {
          console.log(`${locatorKey} is not visible. Skipping click.`);
        }
      });
    } catch (error: unknown) {
      // Error handling for visibility checks or click actions
      await test.step(`Handle error during recovery click`, async () => {
        if (error instanceof Error) {
          console.error(`Test failed with error: ${error.message}`);
          if (capture) {
            await captureScreenshot(page, `recoveryClick_${locatorKey}_failure`, test.info());
          }
          test.fail(true, `Test failed: ${error.message}`);
          throw error;
        } else {
          console.error(`Unknown test failure during recovery click.`);
          if (capture) {
            await captureScreenshot(page, `recoveryClick_${locatorKey}_unknown_failure`, test.info());
          }
          test.fail(true, 'Unknown error occurred during recovery click.');
          throw new Error('Unknown error occurred during recovery click.');
        }
      });
    }
  });
  // *** End of Recovery Click Command *** [Date: ${new Date().toISOString()}]
}


static async getInputData(
  page: Page,
  locatorKey: string,
  capture: boolean = false
): Promise<string | null> {
  // *** Start of Get Input Data Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Get Input Data **
    ** Action: Fetching value from element: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators); // Resolve locator key

  if (!locatorValue) {
    await test.step(`Fail - Locator not found: ${locatorKey}`, async () => {
      if (capture) {
        await captureScreenshot(page, `getInputData_${locatorKey}_not_found`, test.info());
      }
      console.error(`Locator for ${locatorKey} not found.`);
      test.fail(true, `Locator for ${locatorKey} not found.`);
    });
    return null; // Explicitly return null if locator is not found
  }

  try {
    return await test.step(`Fetch value from ${locatorKey}`, async () => {
      // Sub-step: Evaluate and fetch value
      const inputValue = await test.step(`Evaluate DOM to retrieve input value`, async () => {
        return await page.evaluate((selector) => {
          const element = document.evaluate(
            selector,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue as HTMLInputElement;
          return element?.value?.trim() || null;
        }, locatorValue);
      });

      console.log(`Fetched value: ${inputValue}`);

      // Attach the fetched value to Allure report
      test.info().attachments.push({
        name: `Fetched Value for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(inputValue || 'null'),
      });

      // Optional: Capture screenshot for debugging
      if (capture) {
        await test.step(`Capture screenshot for fetched value`, async () => {
          await captureScreenshot(page, `getInputData_${locatorKey}`, test.info());
        });
      }

      return inputValue;
    });
  } catch (error: unknown) {
    await test.step(`Handle error during value retrieval: ${locatorKey}`, async () => {
      if (error instanceof Error) {
        console.error(`Failed to fetch input value: ${error.message}`);
        if (capture) {
          await captureScreenshot(page, `getInputData_${locatorKey}_failure`, test.info());
        }
        test.fail(true, `Failed to fetch input value: ${error.message}`);
      } else {
        console.error(`Unknown error occurred while fetching input data for: ${locatorKey}`);
        if (capture) {
          await captureScreenshot(page, `getInputData_${locatorKey}_failure`, test.info());
        }
        test.fail(true, 'Unknown error occurred during input data retrieval.');
      }
    });
    return null; // Explicitly return null in case of an error
  }
  // *** End of Get Input Data Command *** [Date: ${new Date().toISOString()}]
}



static async getInputDataAndAssert(
  page: Page,
  locatorKey: string,
  expectedValue: string,
  capture: boolean = false
): Promise<void> {
  await test.step(`Assert value for locator: ${locatorKey}`, async () => {
    const maxRetries = 3; // Number of retries
    const retryInterval = 3000; // Interval between retries in ms

    try {
      const locatorValue = resolveLocator(locatorKey, locators);

      if (!locatorValue) {
        test.fail(); // Explicitly mark test as failed
        throw new Error(`Locator for "${locatorKey}" not found.`);
      }

      const elementHandle = page.locator(locatorValue);

      // Scroll and wait for the locator to become visible
      await elementHandle.scrollIntoViewIfNeeded();
      await elementHandle.waitFor({ state: 'visible', timeout: 5000 });

      let fetchedValue: string | null = null;

      // Retry logic to fetch the value
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        fetchedValue = await elementHandle.evaluate((element) => {
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            return element.value?.trim() || null;
          } else if (element instanceof HTMLSelectElement) {
            return element.options[element.selectedIndex]?.text?.trim() || null;
          } else {
            return element.textContent?.trim() || null;
          }
        });

        if (fetchedValue !== null) break; // Exit loop if value is fetched

        console.log(`Attempt ${attempt + 1}: Fetched value is null. Retrying after a hard pause...`);
        
        // Hard pause before retrying
        await page.waitForTimeout(retryInterval);
        await new Promise((resolve) => setTimeout(resolve, retryInterval)); // Additional hard pause
      }

      if (fetchedValue === null) {
        console.error(`Failed to fetch value for ${locatorKey} after ${maxRetries} attempts.`);
        fetchedValue = "null";
      }

      // Attach fetched value to the test report
      test.info().attachments.push({
        name: `Fetched Value for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(fetchedValue || "null"),
      });

      // Normalize values for comparison
      const normalizeValue = (value: string | null | undefined): string => {
        if (value === null || value === undefined || value === "") {
          return "null";
        }
        return value.trim();
      };

      const normalizedExpected = normalizeValue(expectedValue);
      const normalizedFetched = normalizeValue(fetchedValue);

      // Perform the assertion
      if (normalizedFetched !== normalizedExpected) {
        const errorMessage = `Assertion failed. 
          Expected: "${normalizedExpected}" (type: ${typeof normalizedExpected}), 
          Received: "${normalizedFetched}" (type: ${typeof normalizedFetched}).`;

        console.error(errorMessage);

        // Attach error details to the test report
        test.info().attachments.push({
          name: `Assertion Failure Details for ${locatorKey}`,
          contentType: 'text/plain',
          body: Buffer.from(errorMessage),
        });

        test.fail(); // Explicitly mark the test as failed
        throw new Error(errorMessage);
      }

      console.log(`Assertion passed for ${locatorKey}. Value matches expected: "${normalizedExpected}".`);

      // Optionally capture a screenshot for success
      if (capture) {
        const screenshotBuffer = await page.screenshot();
        test.info().attachments.push({
          name: `Assertion Success Screenshot for ${locatorKey}`,
          contentType: 'image/png',
          body: screenshotBuffer,
        });
      }
    } catch (error) {
      // Capture a screenshot on failure
      if (capture) {
        const screenshotBuffer = await page.screenshot();
        test.info().attachments.push({
          name: `Assertion Failure Screenshot for ${locatorKey}`,
          contentType: 'image/png',
          body: screenshotBuffer,
        });
      }

      throw error; // Re-throw the error to ensure proper failure propagation
    }
  });
}


static async waitUntilLocatorInvisible(
  page: Page,
  locator: string,
  timeout: number = 5000,
  capture: boolean = false
): Promise<void> {
  await test.step(`Wait until locator is not visible: ${locator}`, async () => {
    try {
      const elementHandle = page.locator(locator);

      // Wait until the locator is not visible
      await page.waitForFunction(
        async (locatorString) => {
          const element = document.querySelector(locatorString);
          if (!element) return true; // Element not in DOM is treated as not visible
          const style = window.getComputedStyle(element);
          return (
            style.display === "none" ||
            style.visibility === "hidden" ||
            element instanceof HTMLElement && element.offsetParent === null
          );
        },
        locator,
        { timeout }
      );

      console.log(`Locator "${locator}" is no longer visible within ${timeout}ms.`);
    } catch (error) {
      console.error(
        `Locator "${locator}" is still visible after ${timeout}ms.`
      );

      // Attach failure details
      test.info().attachments.push({
        name: `Invisibility Check Failure for ${locator}`,
        contentType: "text/plain",
        body: Buffer.from(`Failed to verify locator "${locator}" is not visible.`),
      });

      // Capture a screenshot on failure
      if (capture) {
        const screenshotBuffer = await page.screenshot();
        test.info().attachments.push({
          name: `Invisibility Check Failure Screenshot for ${locator}`,
          contentType: "image/png",
          body: screenshotBuffer,
        });
      }

      test.fail(); // Mark the test as failed
      throw new Error(`Locator "${locator}" did not become invisible within ${timeout}ms.`);
    }
  });
}




static async getInputDataAndStoreInJson(
  page: Page,
  locatorKey: string,
  jsonFileName: string,
  keyName: string,
  iterationIndex: number,
  capture: boolean = false,
  retries: number = 3,
  hardPause: number = 2000 // Hard pause in milliseconds
): Promise<string | null> {
  console.log(`*** Start of Get Input Data and Store in JSON Command *** [Date: ${new Date().toISOString()}]`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[INFO] Attempt ${attempt}/${retries}: Fetching data from locator "${locatorKey}".`);

      const locatorValue = resolveLocator(locatorKey, locators);
      if (!locatorValue) {
        console.error(`[ERROR] Locator for "${locatorKey}" not found.`);
        throw new Error(`Locator for "${locatorKey}" not found.`);
      }

      const elementHandle = page.locator(locatorValue);

      await test.step(`Wait for locator "${locatorKey}" to be visible`, async () => {
        await elementHandle.scrollIntoViewIfNeeded();
        await elementHandle.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`[INFO] Locator "${locatorKey}" is visible.`);
      });

      const fetchedValue = await test.step(`Fetch value from locator "${locatorKey}"`, async () => {
        return elementHandle.evaluate((element) => {
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            return element.value?.trim() || null;
          } else if (element instanceof HTMLSelectElement) {
            return element.options[element.selectedIndex]?.text?.trim() || null;
          } else {
            return element.textContent?.trim() || null;
          }
        });
      });

      if (!fetchedValue) {
        console.warn(`[WARN] Fetched value is null for locator "${locatorKey}".`);
        await test.step(`Update JSON file "${jsonFileName}" with null`, async () => {
          DataHelper.updateData(jsonFileName, keyName, null, iterationIndex);
          console.log(`[INFO] Updated key "${keyName}" with value "null" in JSON file "${jsonFileName}".`);
        });

        if (capture) {
          const screenshotBuffer = await page.screenshot();
          test.info().attachments.push({
            name: `JSON Update Null Screenshot for ${locatorKey}`,
            contentType: 'image/png',
            body: screenshotBuffer,
          });
        }

        if (attempt === retries) {
          console.log(`[INFO] Maximum retries reached. Storing "null" and continuing.`);
          return null;
        }

        console.log(`[INFO] Hard pause of ${hardPause}ms before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, hardPause));
        continue;
      }

      console.log(`[INFO] Fetched value for "${locatorKey}": "${fetchedValue}".`);

      await test.step(`Update JSON file "${jsonFileName}"`, async () => {
        DataHelper.updateData(jsonFileName, keyName, fetchedValue, iterationIndex);
        console.log(`[INFO] Updated key "${keyName}" with value "${fetchedValue}" in JSON file "${jsonFileName}".`);
      });

      if (capture) {
        const screenshotBuffer = await page.screenshot();
        test.info().attachments.push({
          name: `JSON Update Success Screenshot for ${locatorKey}`,
          contentType: 'image/png',
          body: screenshotBuffer,
        });
      }

      return fetchedValue;
    } catch (error: unknown) {
      console.error(`[ERROR] Attempt ${attempt}/${retries} failed for locator "${locatorKey}".`, error);

      if (attempt === retries) {
        console.warn(`[WARN] Final failure for locator "${locatorKey}". Storing "null" and continuing.`);
        await test.step(`Update JSON file "${jsonFileName}" with null`, async () => {
          DataHelper.updateData(jsonFileName, keyName, null, iterationIndex);
          console.log(`[INFO] Updated key "${keyName}" with value "null" in JSON file "${jsonFileName}".`);
        });

        if (capture) {
          const screenshotBuffer = await page.screenshot();
          test.info().attachments.push({
            name: `JSON Update Final Failure Screenshot for ${locatorKey}`,
            contentType: 'image/png',
            body: screenshotBuffer,
          });
        }

        return null;
      }

      console.log(`[INFO] Hard pause of ${hardPause}ms before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, hardPause));
    }
  }

  console.error(`[ERROR] Unexpected exit from retry loop for locator "${locatorKey}".`);
  return null;
}








static async assertCheckboxState(
  page: Page,
  locatorKey: string,
  expectedState: boolean,
  capture: boolean = false
): Promise<void> {
  // *** Start of Assert Checkbox State Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Assert Checkbox State **
    ** Action: Assert checkbox "${locatorKey}" is ${expectedState ? 'checked' : 'unchecked'} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    await test.step(`Fail - Locator not found: ${locatorKey}`, async () => {
      console.error(`Locator for ${locatorKey} not found.`);
      if (capture) {
        await captureScreenshot(page, `assertCheckboxState_${locatorKey}_locator_not_found`, test.info());
      }
      test.fail(true, `Locator for ${locatorKey} not found.`);
      throw new Error(`Locator for ${locatorKey} not found.`);
    });
  }

  try {
    await test.step(`Assert state of checkbox: ${locatorKey}`, async () => {
      const checkboxLocator = page.locator(locatorValue);

      // Sub-step: Ensure the checkbox is visible before asserting its state
      await test.step(`Ensure checkbox is visible: ${locatorKey}`, async () => {
        await checkboxLocator.waitFor({ state: 'visible' });
      });

      // Sub-step: Retrieve the state of the checkbox
      const isChecked = await test.step(`Retrieve checkbox state: ${locatorKey}`, async () => {
        return await checkboxLocator.isChecked();
      });

      // Sub-step: Validate the state against the expected state
      await test.step(`Validate checkbox state for ${locatorKey}`, async () => {
        if (isChecked !== expectedState) {
          const errorMessage = `Expected checkbox '${locatorKey}' to be ${
            expectedState ? 'checked' : 'unchecked'
          }, but it was ${isChecked ? 'checked' : 'unchecked'}.`;
          console.error(errorMessage);
          if (capture) {
            await captureScreenshot(page, `assertCheckboxState_${locatorKey}_failure`, test.info());
          }
          test.fail(true, errorMessage);
          throw new Error(errorMessage);
        }
        console.log(`Checkbox ${locatorKey} is ${expectedState ? 'checked' : 'unchecked'}, as expected.`);
      });

      // Optional: Capture a screenshot for success
      if (capture) {
        await test.step(`Capture screenshot for checkbox state: ${locatorKey}`, async () => {
          await captureScreenshot(page, `assertCheckboxState_${locatorKey}_success`, test.info());
        });
      }
    });
  } catch (error) {
    await test.step(`Handle error during checkbox state assertion: ${locatorKey}`, async () => {
      if (error instanceof Error) {
        console.error(`Test failed: ${error.message}`);
        if (capture) {
          await captureScreenshot(page, `assertCheckboxState_${locatorKey}_failure`, test.info());
        }
        test.fail(true, `Test failed: ${error.message}`);
        throw error;
      } else {
        console.error(`Unknown test failure.`);
        if (capture) {
          await captureScreenshot(page, `assertCheckboxState_${locatorKey}_unknown_failure`, test.info());
        }
        test.fail(true, 'Unknown error occurred during checkbox state assertion');
        throw new Error('Unknown error occurred during checkbox state assertion');
      }
    });
  }
  // *** End of Assert Checkbox State Command *** [Date: ${new Date().toISOString()}]
}



static async assertRadioButtonState(
  page: Page,
  locatorKey: string,
  expectedState: boolean,
  capture: boolean = false
): Promise<void> {
  try {
    // Resolve the locator value
    const locatorValue = resolveLocator(locatorKey, locators);

    if (!locatorValue) {
      throw new Error(`Locator for "${locatorKey}" not found.`);
    }

    // Locate the radio button element
    const radioButtonLocator = page.locator(locatorValue);

    // Ensure the radio button is visible
    await radioButtonLocator.waitFor({ state: 'visible' });

    // Use Playwright's `expect` to assert the state
    if (expectedState) {
      try {
        await expect(radioButtonLocator).toBeChecked();
      } catch {
        throw new Error(`Expected radio button "${locatorKey}" to be selected.`);
      }
    } else {
      try {
        await expect(radioButtonLocator).not.toBeChecked();
      } catch {
        throw new Error(`Expected radio button "${locatorKey}" to be unselected.`);
      }
    }

    // Optional: Capture a screenshot for success
    if (capture) {
      const screenshotPath = `screenshots/${locatorKey}_success_${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath });
      test.info().attachments.push({
        name: `Screenshot for ${locatorKey} - Success`,
        contentType: 'image/png',
        body: Buffer.from(await page.screenshot()),
      });
    }

    console.log(`Radio button ${locatorKey} is ${expectedState ? 'selected' : 'unselected'}, as expected.`);
  } catch (error) {
    // Handle errors
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error occurred during radio button state assertion';

    console.error(`Error while asserting state of radio button "${locatorKey}": ${errorMessage}`);

    // Capture a screenshot for failure
    if (capture) {
      const screenshotPath = `screenshots/${locatorKey}_failure_${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath });
      test.info().attachments.push({
        name: `Screenshot for ${locatorKey} - Failure`,
        contentType: 'image/png',
        body: Buffer.from(await page.screenshot()),
      });
    }

    // Re-throw the error for proper test failure
    throw error;
  }
}


  // *** Start of Get Checkbox State Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Get Checkbox State **
    ** Action: Get the state (checked/unchecked) of checkbox "${locatorKey}" **
    ********************************************
  */
    static async getCheckboxState(page: Page, locatorKey: string): Promise<boolean> {
      // *** Start of Get Checkbox State Command *** [Date: ${new Date().toISOString()}]
      /*
        ********************************************
        ** Command: Get Checkbox State **
        ** Action: Retrieve the state (checked/unchecked) of the checkbox identified by "${locatorKey}" **
        ********************************************
      */
    
      try {
        // Resolve the locator value
        const locatorValue = resolveLocator(locatorKey, locators);
    
        if (!locatorValue) {
          const errorMessage = `Locator for "${locatorKey}" not found.`;
          console.error(`[ERROR] ${errorMessage}`);
    
          // Attach error details to the report
          test.info().attachments.push({
            name: `Error - Locator Not Found for ${locatorKey}`,
            contentType: 'text/plain',
            body: Buffer.from(errorMessage),
          });
    
          throw new Error(errorMessage);
        }
    
        // Locate the checkbox element
        const checkboxLocator = page.locator(locatorValue);
    
        // Wait for the checkbox to be visible
        await test.step(`Ensure checkbox "${locatorKey}" is visible`, async () => {
          await checkboxLocator.waitFor({ state: 'visible' });
          console.log(`[INFO] Checkbox "${locatorKey}" is visible on the page.`);
        });
    
        // Retrieve the checkbox state
        const isChecked = await test.step(`Check state of checkbox "${locatorKey}"`, async () => {
          return checkboxLocator.isChecked();
        });
    
        // Log the state and attach it to the test report
        const stateMessage = `Checkbox "${locatorKey}" is ${isChecked ? 'checked' : 'unchecked'}.`;
        console.log(`[INFO] ${stateMessage}`);
    
        test.info().attachments.push({
          name: `Checkbox State for ${locatorKey}`,
          contentType: 'text/plain',
          body: Buffer.from(stateMessage),
        });
    
        return isChecked;
      } catch (error: unknown) {
        // Handle and report errors
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown error occurred while retrieving checkbox state.';
    
        console.error(`[ERROR] Error retrieving state of checkbox "${locatorKey}": ${errorMessage}`);
    
        // Attach error details to the test report
        test.info().attachments.push({
          name: `Error Details - Checkbox ${locatorKey}`,
          contentType: 'text/plain',
          body: Buffer.from(errorMessage),
        });
    
        // Capture and attach a screenshot for additional context
        try {
          const screenshotBuffer = await page.screenshot();
          test.info().attachments.push({
            name: `Screenshot - Checkbox ${locatorKey}`,
            contentType: 'image/png',
            body: screenshotBuffer,
          });
        } catch (screenshotError) {
          console.error(
            `[WARN] Unable to capture screenshot for "${locatorKey}": ${
              screenshotError instanceof Error ? screenshotError.message : 'Unknown error'
            }`
          );
        }
    
        // Re-throw the error to fail the test
        throw error instanceof Error ? error : new Error('Unknown error occurred during checkbox state retrieval.');
      }
      // *** End of Get Checkbox State Command *** [Date: ${new Date().toISOString()}]
    }
    

  // *** Start of Get Radio Button State Command *** [Date: ${new Date().toISOString()}]
  /*
    **********************************************
    ** Command: Get Radio Button State **
    ** Action: Get the state (selected/unselected) of radio button "${locatorKey}" **
    **********************************************
  */
    static async getRadioButtonState(page: Page, locatorKey: string): Promise<boolean> {
      // *** Start of Get Radio Button State Command *** [Date: ${new Date().toISOString()}]
      /*
        ********************************************
        ** Command: Get Radio Button State **
        ** Action: Retrieve the state (selected/unselected) of the radio button identified by "${locatorKey}" **
        ********************************************
      */
    
      try {
        // Resolve the locator value
        const locatorValue = resolveLocator(locatorKey, locators);
    
        if (!locatorValue) {
          const errorMessage = `Locator for "${locatorKey}" not found.`;
          console.error(`[ERROR] ${errorMessage}`);
    
          // Attach error details to the test report
          test.info().attachments.push({
            name: `Error - Locator Not Found for ${locatorKey}`,
            contentType: 'text/plain',
            body: Buffer.from(errorMessage),
          });
    
          throw new Error(errorMessage);
        }
    
        // Locate the radio button element
        const radioButtonLocator = page.locator(locatorValue);
    
        // Wait for the radio button to be visible
        await test.step(`Ensure radio button "${locatorKey}" is visible`, async () => {
          await radioButtonLocator.waitFor({ state: 'visible' });
          console.log(`[INFO] Radio button "${locatorKey}" is visible on the page.`);
        });
    
        // Retrieve the radio button state
        const isSelected = await test.step(`Check state of radio button "${locatorKey}"`, async () => {
          return radioButtonLocator.isChecked();
        });
    
        // Log the state and attach it to the test report
        const stateMessage = `Radio button "${locatorKey}" is ${isSelected ? 'selected' : 'unselected'}.`;
        console.log(`[INFO] ${stateMessage}`);
    
        test.info().attachments.push({
          name: `Radio Button State for ${locatorKey}`,
          contentType: 'text/plain',
          body: Buffer.from(stateMessage),
        });
    
        return isSelected;
      } catch (error: unknown) {
        // Handle and report errors
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unknown error occurred while retrieving the radio button state.';
        console.error(`[ERROR] Error retrieving state of radio button "${locatorKey}": ${errorMessage}`);
    
        // Attach error details to the test report
        test.info().attachments.push({
          name: `Error Details - Radio Button ${locatorKey}`,
          contentType: 'text/plain',
          body: Buffer.from(errorMessage),
        });
    
        // Capture and attach a screenshot for additional context
        try {
          const screenshotBuffer = await page.screenshot();
          test.info().attachments.push({
            name: `Screenshot - Radio Button ${locatorKey}`,
            contentType: 'image/png',
            body: screenshotBuffer,
          });
        } catch (screenshotError) {
          console.error(
            `[WARN] Unable to capture screenshot for "${locatorKey}": ${
              screenshotError instanceof Error ? screenshotError.message : 'Unknown error'
            }`
          );
        }
    
        // Re-throw the error to fail the test
        throw error instanceof Error
          ? error
          : new Error('An unknown error occurred while retrieving the radio button state.');
      }
      // *** End of Get Radio Button State Command *** [Date: ${new Date().toISOString()}]
    }
    



static async clearTextField(
  page: Page,
  locatorKey: string,
  capture: boolean = false
): Promise<void> {
  // *** Start of Clear Text Field Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Clear Text Field **
    ** Action: Clear text field for locator: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    await test.step(`Fail - Locator not found: ${locatorKey}`, async () => {
      console.error(`Locator for ${locatorKey} not found.`);
      if (capture) {
        await captureScreenshot(page, `clearTextField_${locatorKey}_locator_not_found`, test.info());
      }
      test.fail(true, `Locator for ${locatorKey} not found.`);
      throw new Error(`Locator for ${locatorKey} not found.`);
    });
  }

  try {
    await test.step(`Clear text field: ${locatorKey}`, async () => {
      const textFieldLocator = page.locator(locatorValue);

      // Sub-step: Ensure the text field is visible before interacting with it
      await test.step(`Ensure text field is visible: ${locatorKey}`, async () => {
        await textFieldLocator.waitFor({ state: 'visible' });
      });

      // Sub-step: Clear the text field
      await test.step(`Clear the text field: ${locatorKey}`, async () => {
        await textFieldLocator.fill('');
        console.log(`Successfully cleared the text field: ${locatorKey}`);
      });

      // Optional: Attach a screenshot after clearing
      if (capture) {
        await test.step(`Capture screenshot for cleared text field: ${locatorKey}`, async () => {
          await captureScreenshot(page, `clearTextField_${locatorKey}_success`, test.info());
        });
      }
    });
  } catch (error) {
    await test.step(`Handle error while clearing text field: ${locatorKey}`, async () => {
      if (error instanceof Error) {
        console.error(`Test failed: ${error.message}`);
        if (capture) {
          await captureScreenshot(page, `clearTextField_${locatorKey}_failure`, test.info());
        }
        test.fail(true, `Test failed: ${error.message}`);
        throw error;
      } else {
        console.error(`Unknown test failure.`);
        if (capture) {
          await captureScreenshot(page, `clearTextField_${locatorKey}_unknown_failure`, test.info());
        }
        test.fail(true, 'Unknown error occurred while clearing text field');
        throw new Error('Unknown error occurred while clearing text field');
      }
    });
  }
  // *** End of Clear Text Field Command *** [Date: ${new Date().toISOString()}]
}


static async selectMatOptionByText(
  page: Page,
  listLocatorKey: string,
  value: string,
  capture: boolean = false
): Promise<void> {
  const listLocatorValue = resolveLocator(listLocatorKey, locators);

  if (!listLocatorValue) {
    const errorMessage = `Locator for "${listLocatorKey}" not found.`;
    console.error(`[ERROR] ${errorMessage}`);

    // Fail the test and capture a screenshot
    test.fail(true, errorMessage);
    throw new Error(errorMessage);  // Explicitly throw error to fail the test
  }

  try {
    await test.step(`Select mat-option "${value}" using locator: ${listLocatorKey}`, async () => {
      console.log(`[INFO] Starting selection of value "${value}" for locator key: ${listLocatorKey}`);

      const listLocator = page.locator(`${listLocatorValue}[id^='mat-autocomplete-']`);

      try {
        // Wait for the locator to become visible with timeout 10000ms (10 seconds)
        await listLocator.waitFor({ state: 'visible', timeout: 10000 });
      } catch (error) {
        const errorMessage = `Locator for "${listLocatorKey}" did not become visible within 10000ms.`;
        console.error(`[ERROR] ${errorMessage}`);
        test.fail(true, errorMessage); // Explicit failure
        throw new Error(errorMessage); // Throw the error to ensure failure
      }

      const isLocatorVisible = await listLocator.isVisible();
      expect(isLocatorVisible).toBeTruthy(); // Force failure if the locator is not visible

      console.log(`[INFO] Mat-option list located and visible for key: ${listLocatorKey}`);

      const options = listLocator.locator('mat-option span.mdc-list-item__primary-text');
      const count = await options.count();
      console.log(`[INFO] Number of options found: ${count}`);

      if (count === 0) {
        const errorMessage = `No options available in the mat-option list for locator: ${listLocatorKey}`;
        console.error(`[ERROR] ${errorMessage}`);
        test.fail(true, errorMessage); // Explicit failure
        throw new Error(errorMessage); // Throw the error to ensure failure
      }

      let isValueFound = false;
      const availableValues: string[] = [];

      for (let i = 0; i < count; i++) {
        const option = options.nth(i);
        const textContent = await option.textContent();
        if (textContent) {
          availableValues.push(textContent.trim());
        }

        if (textContent?.trim() === value) {
          console.log(`[INFO] Found matching value: "${textContent.trim()}"`);
          await option.evaluate((element: HTMLElement) => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          });
          await option.click();
          isValueFound = true;
          break;
        }
      }

      if (!isValueFound) {
        const errorMessage = `Value "${value}" not found in the mat-option list. Available values: ${availableValues.join(', ')}`;
        console.error(`[ERROR] ${errorMessage}`);
        test.fail(true, errorMessage); // Explicit failure
        throw new Error(errorMessage); // Throw the error to ensure failure
      }

      console.log(`[INFO] Successfully selected value: "${value}"`);

      if (capture) {
        await captureScreenshot(page, `select_mat_option_${listLocatorKey}_success`, test.info());
      }
    });
  } catch (error: unknown) {
    const errorMessage = `Error selecting mat-option "${value}" for locator: ${listLocatorKey}. ${
      error instanceof Error ? error.message : 'Unknown error occurred.'
    }`;
    console.error(`[ERROR] ${errorMessage}`);
    test.info().attachments.push({
      name: `Error Details for ${listLocatorKey}`,
      contentType: 'text/plain',
      body: Buffer.from(errorMessage),
    });

    if (capture) {
      await captureScreenshot(page, `select_mat_option_${listLocatorKey}_failure`, test.info());
    }

    test.fail(true, errorMessage); // Explicit failure
    throw error instanceof Error ? error : new Error('Unknown error occurred'); // Ensure error is thrown
  }
}




static async selectMatOptionContainingText(
  page: Page,
  listLocatorKey: string,
  value: string,
  capture: boolean = false
): Promise<void> {
  // *** Start of Select Mat Option Command *** [Date: ${new Date().toISOString()}]
  console.log(`[INFO] Initiating selection for value containing "${value}" using locator key: ${listLocatorKey}`);

  const listLocatorValue = resolveLocator(listLocatorKey, locators);

  if (!listLocatorValue) {
    const errorMessage = `Locator for "${listLocatorKey}" not found.`;
    console.error(`[ERROR] ${errorMessage}`);

    // Fail the test explicitly and capture details
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  try {
    await test.step(`Select mat-option containing "${value}" using locator: ${listLocatorKey}`, async () => {
      console.log(`[INFO] Starting selection of value containing "${value}" for locator key: ${listLocatorKey}`);

      // Locate the mat-autocomplete container
      const listLocator = page.locator(`${listLocatorValue}[id^='mat-autocomplete-']`);
      await listLocator.waitFor({ state: 'visible', timeout: 5000 });
      console.log(`[INFO] Mat-option list located and visible for key: ${listLocatorKey}`);

      // Retrieve all mat-option elements
      const options = listLocator.locator('mat-option span.mdc-list-item__primary-text');
      const count = await options.count();
      console.log(`[INFO] Number of options found: ${count}`);

      if (count === 0) {
        const errorMessage = `No options available in the mat-option list for locator: ${listLocatorKey}`;
        console.error(`[ERROR] ${errorMessage}`);

        // Fail the test explicitly
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }

      let isValueFound = false;
      const availableValues: string[] = [];

      // Iterate through options to find the desired value
      for (let i = 0; i < count; i++) {
        const option = options.nth(i);
        const textContent = await option.textContent();

        if (textContent) {
          const trimmedValue = textContent.trim();
          availableValues.push(trimmedValue);

          if (trimmedValue.includes(value)) { // Check if the text contains the desired value
            console.log(`[INFO] Found matching value containing "${value}": "${trimmedValue}"`);

            // Scroll into view and click the option
            await option.evaluate((element: HTMLElement) => {
              element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            });
            await option.click();

            isValueFound = true;
            break;
          }
        }
      }

      if (!isValueFound) {
        const errorMessage = `Value containing "${value}" not found in the mat-option list. Available values: ${availableValues.join(', ')}`;
        console.error(`[ERROR] ${errorMessage}`);

        // Attach available values to the test report
        test.info().attachments.push({
          name: `Available Values for ${listLocatorKey}`,
          contentType: 'text/plain',
          body: Buffer.from(`Available values: ${availableValues.join(', ')}`),
        });

        // Fail the test explicitly
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`[INFO] Successfully selected value containing "${value}"`);

      // Capture a screenshot on success if required
      if (capture) {
        await captureScreenshot(page, `select_mat_option_${listLocatorKey}_success`, test.info());
      }
    });
  } catch (error: unknown) {
    const errorMessage = `Error selecting mat-option containing "${value}" for locator: ${listLocatorKey}. ${
      error instanceof Error ? error.message : 'Unknown error occurred.'
    }`;
    console.error(`[ERROR] ${errorMessage}`);

    // Attach error details to the test report
    test.info().attachments.push({
      name: `Error Details for ${listLocatorKey}`,
      contentType: 'text/plain',
      body: Buffer.from(errorMessage),
    });

    // Capture a failure screenshot
    if (capture) {
      await captureScreenshot(page, `select_mat_option_${listLocatorKey}_failure`, test.info());
    }

    // Fail the test explicitly and re-throw the error
    test.fail(true, errorMessage);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }

  console.log(`[INFO] Completed selection for value containing "${value}"`);
  // *** End of Select Mat Option Command *** [Date: ${new Date().toISOString()}]
}



static async selectFirstMatOption(
  page: Page,
  listLocatorKey: string,
  capture: boolean = false
): Promise<void> {
  // *** Start of Select First Mat Option Command *** [Date: ${new Date().toISOString()}]
  console.log(`[INFO] Initiating selection of the first option using locator key: ${listLocatorKey}`);

  const listLocatorValue = resolveLocator(listLocatorKey, locators);

  if (!listLocatorValue) {
    const errorMessage = `Locator for "${listLocatorKey}" not found.`;
    console.error(`[ERROR] ${errorMessage}`);

    // Fail the test explicitly and capture details
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  try {
    await test.step(`Select first mat-option using locator: ${listLocatorKey}`, async () => {
      console.log(`[INFO] Starting selection of the first mat-option for locator key: ${listLocatorKey}`);

      // Locate the mat-autocomplete container
      const listLocator = page.locator(`${listLocatorValue}[id^='mat-autocomplete-']`);
      await listLocator.waitFor({ state: 'visible', timeout: 5000 });
      console.log(`[INFO] Mat-option list located and visible for key: ${listLocatorKey}`);

      // Retrieve all mat-option elements
      const options = listLocator.locator('mat-option span.mdc-list-item__primary-text');
      const count = await options.count();
      console.log(`[INFO] Number of options found: ${count}`);

      if (count === 0) {
        const errorMessage = `No options available in the mat-option list for locator: ${listLocatorKey}`;
        console.error(`[ERROR] ${errorMessage}`);

        // Fail the test explicitly
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }

      // Select the first option
      const firstOption = options.nth(0);
      const firstOptionText = await firstOption.textContent();

      if (!firstOptionText) {
        const errorMessage = `First option is empty or could not be located for locator: ${listLocatorKey}`;
        console.error(`[ERROR] ${errorMessage}`);

        // Fail the test explicitly
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`[INFO] Selecting first option: "${firstOptionText.trim()}"`);

      // Scroll into view and click the first option
      await firstOption.evaluate((element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      });
      await firstOption.click();

      console.log(`[INFO] Successfully selected the first option: "${firstOptionText.trim()}"`);

      // Capture a screenshot on success if required
      if (capture) {
        await captureScreenshot(page, `select_first_mat_option_${listLocatorKey}_success`, test.info());
      }
    });
  } catch (error: unknown) {
    const errorMessage = `Error selecting the first mat-option for locator: ${listLocatorKey}. ${
      error instanceof Error ? error.message : 'Unknown error occurred.'
    }`;
    console.error(`[ERROR] ${errorMessage}`);

    // Attach error details to the test report
    test.info().attachments.push({
      name: `Error Details for ${listLocatorKey}`,
      contentType: 'text/plain',
      body: Buffer.from(errorMessage),
    });

    // Capture a failure screenshot
    if (capture) {
      await captureScreenshot(page, `select_first_mat_option_${listLocatorKey}_failure`, test.info());
    }

    // Fail the test explicitly and re-throw the error
    test.fail(true, errorMessage);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }

  console.log(`[INFO] Completed selection of the first mat-option`);
  // *** End of Select First Mat Option Command *** [Date: ${new Date().toISOString()}]
}




static async getMatOptions(
  page: Page,
  listLocatorKey: string
): Promise<string[]> {
  const listLocatorValue = resolveLocator(listLocatorKey, locators);

  if (!listLocatorValue) {
    throw new Error(`Locator for ${listLocatorKey} not found.`);
  }

  return await test.step(`Retrieve mat-options from locator: "${listLocatorKey}"`, async () => {
    try {
      console.log(`Retrieving all options from mat-option list: ${listLocatorKey}`);

      // Locate the list container
      const listLocator = page.locator(`${listLocatorValue}[id^='mat-autocomplete-']`);

      // Wait for the list to be visible
      await listLocator.waitFor({ state: 'visible' });

      // Get all 'mat-option' elements inside the list
      const options = listLocator.locator('mat-option span.mdc-list-item__primary-text');

      // Count the number of options
      const count = await options.count();
      console.log(`Number of options found: ${count}`);

      if (count === 0) {
        console.warn(`No options found in the list: ${listLocatorKey}`);
        return [];
      }

      // Initialize an array to store the option texts
      const optionTexts: string[] = [];

      // Loop through each option and collect the text content
      for (let i = 0; i < count; i++) {
        const option = options.nth(i);
        const textContent = await option.textContent();

        if (textContent) {
          const trimmedText = textContent.trim();
          optionTexts.push(trimmedText);
          console.log(`Option ${i + 1}: ${trimmedText}`);
        } else {
          console.warn(`Option ${i + 1} is empty. Skipping.`);
        }
      }

      console.log(`Retrieved options: ${JSON.stringify(optionTexts)}`);

      // Attach the retrieved options to the test report
      test.info().attachments.push({
        name: `Mat Options for ${listLocatorKey}`,
        contentType: 'application/json',
        body: Buffer.from(JSON.stringify(optionTexts, null, 2)),
      });

      return optionTexts; // Return the array of option texts
    } catch (error: unknown) {
      console.error(`Failed to retrieve options: ${error instanceof Error ? error.message : error}`);
      await captureScreenshot(page, `get_mat_options_${listLocatorKey}_failure`, test.info());
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  });
}


static async iterateAndSelectOption(
  page: Page,
  listLocatorKey: string,
  firstCheckLocator: string,
  secondCheckLocator: string,
  clearFieldLocator1: string,
  clearFieldLocator2: string,
  clickFieldLocator: string,
  wait: number = 5000
): Promise<void> {
  // *** Start of Iterate and Select Option Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Iterate and Select Option **
    ** Action: Iterating over options to find valid selections **
    ** List Locator Key: ${listLocatorKey} **
    ** First Check Locator: ${firstCheckLocator} **
    ** Second Check Locator: ${secondCheckLocator} **
    ********************************************
  */

  const listLocatorValue = resolveLocator(listLocatorKey, locators);

  if (!listLocatorValue) {
    const errorMessage = `Locator for ${listLocatorKey} not found.`;
    console.error(`[ERROR] ${errorMessage}`);

    test.info().attachments.push({
      name: `Error Details for ${listLocatorKey}`,
      contentType: 'text/plain',
      body: Buffer.from(errorMessage),
    });

    throw new Error(errorMessage);
  }

  try {
    await test.step(`Iterate and select options from list: ${listLocatorKey}`, async () => {
      console.log(`[INFO] Starting iteration over options from list: ${listLocatorKey}`);

      // Locate the list container with dynamic ID
      const listLocator = page.locator(`${listLocatorValue}[id^='mat-autocomplete-']`);

      // Wait for the list to be visible
      await listLocator.waitFor({ state: 'visible', timeout: wait });
      console.log(`[INFO] List container for "${listLocatorKey}" is visible.`);

      // Get all 'mat-option' elements inside the list
      const options = listLocator.locator('mat-option span.mdc-list-item__primary-text');
      const count = await options.count();
      console.log(`[INFO] Number of options found: ${count}`);

      if (count === 0) {
        const errorMessage = `No options found in the list for locator: ${listLocatorKey}`;
        console.error(`[ERROR] ${errorMessage}`);
        throw new Error(errorMessage);
      }

      for (let i = 0; i < count; i++) {
        const option = options.nth(i);
        const textContent = await option.textContent();

        if (textContent) {
          const trimmedText = textContent.trim();
          console.log(`[INFO] Iterating option ${i + 1}: "${trimmedText}"`);

          // Scroll into view and select the option
          await option.evaluate((element: HTMLElement) => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          });
          await option.click();
          console.log(`[INFO] Selected option: "${trimmedText}"`);
          await BaseCommandCaller.hardPause(page, wait);
          // Check for the presence of the first locator
          const isFirstLocatorPresent = await BaseCommandCaller.isLocatorPresent(page, firstCheckLocator, wait, 'soft');
          if (isFirstLocatorPresent) {
            console.log(`[INFO] First locator "${firstCheckLocator}" is available. Stopping iteration.`);
            return; // Exit if the first locator is found
          }

          // Check for the presence of the second locator
          await BaseCommandCaller.hardPause(page, wait);
          const isSecondLocatorPresent = await BaseCommandCaller.isLocatorPresent(page, secondCheckLocator, wait, 'soft');
          if (isSecondLocatorPresent) {
            console.log(`[INFO] Second locator "${secondCheckLocator}" is available. Clearing fields and retrying.`);
            await BaseCommandCaller.hardPause(page, wait);
            await BaseCommandCaller.click(page, secondCheckLocator);
            await BaseCommandCaller.hardPause(page, wait);
            await BaseCommandCaller.clearTextField(page, clearFieldLocator1);
            await BaseCommandCaller.clearTextField(page, clearFieldLocator2);
            await BaseCommandCaller.click(page, clickFieldLocator);

            continue; // Retry the next iteration
          } else {
            console.log(`[INFO] Neither locator is available for option ${i + 1}. Retrying.`);
            await BaseCommandCaller.hardPause(page, wait);
            await BaseCommandCaller.clearTextField(page, clearFieldLocator1);
            await BaseCommandCaller.clearTextField(page, clearFieldLocator2);
            await BaseCommandCaller.click(page, clickFieldLocator);
          }
        } else {
          console.log(`[WARN] Skipping empty option at index ${i + 1}.`);
        }
      }

      console.log(`[ERROR] No valid options found after iterating through the list.`);
      throw new Error('No valid options found in the list.');
    });
  } catch (error: unknown) {
    const errorMessage = `Failed during iteration over options for "${listLocatorKey}". ${
      error instanceof Error ? error.message : 'Unknown error occurred.'
    }`;
    console.error(`[ERROR] ${errorMessage}`);

    test.info().attachments.push({
      name: `Error Details for ${listLocatorKey}`,
      contentType: 'text/plain',
      body: Buffer.from(errorMessage),
    });

    await captureScreenshot(page, `iterate_and_select_option_failure`, test.info());
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }

  // *** End of Iterate and Select Option Command *** [Date: ${new Date().toISOString()}]
}

/**
 * Updates a JSON file with the provided value at a specific key and index.
 */
static async updateJsonFile(
  jsonFileName: string,
  keyName: string,
  value: string,
  iterationIndex: number,
  retries: number = 3
): Promise<void> {
  console.log(`*** Start of Update JSON File Command *** [Date: ${new Date().toISOString()}]`);

  // Correctly resolve the JSON file path relative to the StaticDataTables folder
  const filePath = path.resolve(__dirname, '../../DataTables/StaticDataTables', `${jsonFileName}.json`);

  // Fail if the JSON file does not exist
  if (!fs.existsSync(filePath)) {
    console.error(`JSON file not found at path: ${filePath}`);
    throw new Error(`JSON file not found at path: ${filePath}`);
  }

  await test.step(`Update JSON file "${jsonFileName}"`, async () => {
    let jsonData: any; // Define the structure of the JSON if possible
    let attempts = 0;
    let success = false;

    while (attempts < retries && !success) {
      attempts++;
      try {
        console.log(`Attempt ${attempts}/${retries}: Reading and updating JSON file "${filePath}"`);

        // Step 1: Read and parse the JSON file
        await test.step('Read and parse JSON file', async () => {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          jsonData = JSON.parse(fileContent);
          console.log(`Original JSON Content: ${fileContent}`);
        });

        // Step 2: Validate the iteration index
        await test.step('Validate iteration index', async () => {
          if (iterationIndex < 0 || iterationIndex >= jsonData.length) {
            const errorMsg = `Invalid iteration index: ${iterationIndex}. Must be within JSON data length.`;
            console.error(errorMsg);
            throw new Error(errorMsg);
          }
        });

        // Step 3: Update the JSON data
        await test.step(`Update key "${keyName}" with value "${value}" at index ${iterationIndex}`, async () => {
          jsonData[iterationIndex][keyName] = value;
          console.log(
            `Updated key "${keyName}" with value "${value}" in JSON at index ${iterationIndex}.`
          );
        });

        // Step 4: Write updated JSON data back to the file
        await test.step('Write updated JSON data to file', async () => {
          fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
          console.log(`Updated JSON file successfully written to: ${filePath}`);
        });

        success = true;
      } catch (error: unknown) {
        console.error(
          `Attempt ${attempts}/${retries} failed to update JSON file "${filePath}". Error: ${
            (error as Error).message || 'Unknown error'
          }`
        );

        if (attempts === retries) {
          console.error(`All ${retries} attempts failed to update JSON file "${filePath}"`);
          throw error;
        }

        console.log(`Retrying update for JSON file "${filePath}"...`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying
      }
    }
  });

  console.log(`*** End of Update JSON File Command ***`);
}





static async storeDataFromLocatorToJson(
  page: Page,
  locatorKey: string,
  jsonFileName: string,
  keyName: string,
  iterationIndex: number,
  retries: number = 3,
  capture: boolean = false
): Promise<void> {
  console.log(`*** Start of Store Data From Locator Command *** [Date: ${new Date().toISOString()}]`);

  const locatorValue = resolveLocator(locatorKey, locators);

  // Fail test if locator itself is not found
  if (!locatorValue) {
    if (capture) {
      await captureScreenshot(page, `storeDataFromLocator_${locatorKey}_not_found`, test.info());
    }
    console.error(`Locator for "${locatorKey}" not found.`);
    throw new Error(`Locator for "${locatorKey}" not found.`);
  }

  await test.step(`Store data from locator "${locatorKey}" to JSON file "${jsonFileName}"`, async () => {
    let fetchedValue: string | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${retries}: Fetching data from locator "${locatorKey}"`);

        // Scroll to and wait for the locator to be visible
        await test.step(`Scroll and wait for locator: ${locatorKey}`, async () => {
          const elementHandle = page.locator(locatorValue);
          await elementHandle.scrollIntoViewIfNeeded();
          await elementHandle.waitFor({ state: 'visible', timeout: 5000 });
        });

        // Fetch the value from the locator
        fetchedValue = await test.step(`Fetch value from locator: ${locatorKey}`, async () => {
          return await page.evaluate((selector) => {
            const element = document.evaluate(
              selector,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue as HTMLInputElement | HTMLTextAreaElement | HTMLElement;

            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
              return element.value?.trim() || null; // Return null if no value
            } else {
              return element.textContent?.trim() || null; // Return null if no text content
            }
          }, locatorValue);
        });

        console.log(`Fetched value: "${fetchedValue}"`);

        if (fetchedValue !== null) {
          break; // Exit the loop on success
        }

        console.log(`Fetched value is null. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying
      } catch (error: unknown) {
        console.error(
          `Attempt ${attempt}/${retries} failed for locator: ${locatorKey}. Error: ${
            (error as Error).message || 'Unknown error'
          }`
        );

        if (attempt === retries) {
          console.error(`All ${retries} attempts failed for locator: ${locatorKey}`);
          if (capture) {
            await captureScreenshot(page, `storeDataFromLocator_${locatorKey}_failure`, test.info());
          }
        }
      }
    }

    // Update the JSON file with the fetched value (even if it's null)
    await test.step(`Update JSON file: ${jsonFileName}`, async () => {
      DataHelper.updateData(jsonFileName, keyName, fetchedValue ?? "null", iterationIndex);
      console.log(`Updated key "${keyName}" with value "${fetchedValue ?? "null"}" in JSON.`);
    });

    if (capture && fetchedValue === null) {
      await captureScreenshot(page, `storeDataFromLocator_${locatorKey}_final_null`, test.info());
    }
  });

  console.log(`*** End of Store Data From Locator Command ***`);
}







static async getSelectedOptionTextAndStoreInJson(
  page: Page,
  locatorKey: string,
  jsonFileName: string,
  keyName: string,
  iterationIndex: number, // Index in the JSON array to store the data
  capture: boolean = false,
  retries: number = 3
): Promise<string | null> {
  // *** Start of Get Selected Option Text Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Get Selected Option Text and Store in JSON **
    ** Action: Fetch selected option text and update JSON **
    ** Locator Key: ${locatorKey} **
    ** JSON File: ${jsonFileName} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    const errorMessage = `Locator for ${locatorKey} not found.`;
    console.error(`[ERROR] ${errorMessage}`);

    // Attach error details to test report
    test.info().attachments.push({
      name: `Error Details for ${locatorKey}`,
      contentType: 'text/plain',
      body: Buffer.from(errorMessage),
    });

    if (capture) {
      await captureScreenshot(page, `getSelectedOptionTextAndStoreInJson_${locatorKey}_not_found`, test.info());
    }

    throw new Error(errorMessage);
  }

  let selectedText: string | null = null;

  try {
    await test.step(`Get selected option text from "${locatorKey}" and store in "${jsonFileName}"`, async () => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`[INFO] Attempt ${attempt}/${retries}: Fetching selected text for "${locatorKey}".`);

          // Scroll and wait for the element to be visible
          await test.step(`Scroll and wait for locator: ${locatorKey}`, async () => {
            const elementHandle = page.locator(locatorValue);
            await elementHandle.scrollIntoViewIfNeeded();
            await elementHandle.waitFor({ state: 'visible', timeout: 5000 });
          });

          // Fetch the selected option text
          selectedText = await test.step(`Fetch selected option text`, async () => {
            const elementHandle = page.locator(locatorValue);
            return await elementHandle.evaluate((select) => {
              if (!(select instanceof HTMLSelectElement)) {
                throw new Error('Locator is not a valid <select> element.');
              }
              const selectedOption = select.selectedOptions[0];
              return selectedOption ? selectedOption.textContent?.trim() || null : null;
            });
          });

          if (!selectedText) {
            throw new Error(`[ERROR] No option is selected in "${locatorKey}".`);
          }

          console.log(`[INFO] Fetched selected text: "${selectedText}".`);

          // Update JSON with the selected text
          await test.step(`Update JSON file "${jsonFileName}"`, async () => {
            DataHelper.updateData(jsonFileName, keyName, selectedText, iterationIndex);
            console.log(`[INFO] Updated key "${keyName}" with value "${selectedText}" in JSON file "${jsonFileName}".`);
          });

          // Attach success details to the report
          test.info().attachments.push({
            name: `Selected Text for ${locatorKey}`,
            contentType: 'text/plain',
            body: Buffer.from(selectedText),
          });

          // Capture screenshot on success if required
          if (capture) {
            await captureScreenshot(page, `getSelectedOptionTextAndStoreInJson_${locatorKey}_success`, test.info());
          }

          return selectedText; // Exit loop on success
        } catch (error) {
          console.error(`[ERROR] Attempt ${attempt}/${retries} failed for "${locatorKey}".`);

          if (attempt === retries) {
            // On final failure, capture screenshot and log error
            if (capture) {
              await captureScreenshot(page, `getSelectedOptionTextAndStoreInJson_${locatorKey}_failure`, test.info());
            }
            console.error(`[CRITICAL ERROR] Failed after ${retries} retries for "${locatorKey}".`);
            throw error instanceof Error ? error : new Error('Unknown error occurred.');
          }

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    });

    // If selectedText is null after retries, log a warning
    if (selectedText === null) {
      console.warn(`[WARN] Fetched selected text is null for locator "${locatorKey}".`);
    }

    return selectedText; // Return the fetched value or null if none was found
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
    console.error(`[ERROR] Critical failure during execution: ${errorMessage}`);

    if (capture) {
      await captureScreenshot(page, `getSelectedOptionTextAndStoreInJson_${locatorKey}_critical_failure`, test.info());
    }

    // Rethrow the error to fail the test
    throw new Error(errorMessage);
  }

  // *** End of Get Selected Option Text Command *** [Date: ${new Date().toISOString()}]
}





static async assertSelectedOption(
  page: Page,
  locatorKey: string,
  expectedText: string,
  capture: boolean = false
): Promise<void> {
  // *** Start of Assert Selected Option Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Assert Selected Option ** 
    ** Action: Assert that selected option matches "${expectedText}" on locator: "${locatorKey}" **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // If the locator is not found, fail the test and capture a screenshot
    await test.step(`Fail - Locator not found: ${locatorKey}`, async () => {
      if (capture) {
        await captureScreenshot(page, `assertSelectedOption_${locatorKey}_not_found`, test.info());
      }
      console.error(`Locator for ${locatorKey} not found.`);
      test.fail(true, `Locator for ${locatorKey} not found.`);
    });
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  await test.step(`Assert selected option of ${locatorKey} matches "${expectedText}"`, async () => {
    try {
      // Fetch the selected option's text using JavaScript
      const selectedText = await page.evaluate((selector) => {
        const selectElement = document.evaluate(
          selector,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue as HTMLSelectElement;

        if (!selectElement) throw new Error('Select element not found.');
        const selectedOption = selectElement.selectedOptions[0];
        return selectedOption ? selectedOption.textContent?.trim() : null;
      }, locatorValue);

      if (!selectedText) {
        throw new Error(`No option is selected in ${locatorKey}.`);
      }

      // Trim both the actual and expected text before assertion
      const trimmedSelectedText = selectedText.trim();
      const trimmedExpectedText = expectedText.trim();

      // Assert the selected text matches the expected text
      if (trimmedSelectedText !== trimmedExpectedText) {
        throw new Error(
          `Selected option mismatch. Expected: "${trimmedExpectedText}", Actual: "${trimmedSelectedText}"`
        );
      }

      console.log(`Assertion passed. Selected option matches "${expectedText}" for ${locatorKey}`);

      // Attach the selected option details to the report
      test.info().attachments.push({
        name: `Selected Option for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Expected: "${trimmedExpectedText}", Actual: "${trimmedSelectedText}"`),
      });

      // Capture screenshot after successful assertion if capture flag is true
      if (capture) {
        await captureScreenshot(page, `assertSelectedOption_${locatorKey}_success`, test.info());
      }
    } catch (error: unknown) {
      await test.step(`Handle failure for selected option assertion`, async () => {
        if (error instanceof Error) {
          console.error(`Test failed with error: ${error.message}`);
          if (capture) {
            await captureScreenshot(page, `assertSelectedOption_${locatorKey}_failure`, test.info());
          }
          test.fail(true, `Selected option assertion failed: ${error.message}`);
          throw error;
        } else {
          console.error(`Unknown error occurred during selected option assertion on ${locatorKey}`);
          if (capture) {
            await captureScreenshot(page, `assertSelectedOption_${locatorKey}_unknown_failure`, test.info());
          }
          test.fail(true, 'Unknown error occurred during selected option assertion');
          throw new Error('Unknown error occurred during selected option assertion');
        }
      });
    }
  });
  // *** End of Assert Selected Option Command *** [Date: ${new Date().toISOString()}]
}


// Method to generate a random 3 to 4 digit number as a string
static async generateRandomNumber(): Promise<string> {
  const min = 100;    // Minimum 3-digit number
  const max = 9999;   // Maximum 4-digit number
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString(); // Return the number as a string
}


static async generateFormattedDate(dateInput?: Date): Promise<string> {
  const now = dateInput || new Date(); // Use provided date or today's date

  const day = String(now.getDate()).padStart(2, '0'); // Ensure 2-digit day
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month (Month is 0-indexed)
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0'); // Ensure 2-digit hour
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensure 2-digit minutes

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Method to get all available indices for a locator dynamically with scroll and screenshot on failure
static async getAllIndices(page: Page, locatorKey: string, capture: boolean = false): Promise<number[]> {
  // *** Start of Get Indices Command *** [Date: 2024-12-26 10:30:00]
  /*
    ********************************************
    ** Command: Get All Indices for Locator **
    ** Action: Fetching all indices for locator: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // Mark the test as failed and capture screenshot
    test.fail(true, `Locator for ${locatorKey} not found.`); // Fail the test explicitly
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  // Log the start of the action and execute the step
  try {
    return await test.step(`Get all indices for locator: ${locatorKey}`, async () => {
      const locator = page.locator(locatorValue);

      // Evaluate to get all matching elements
      const elements = await locator.elementHandles();

      if (elements.length === 0) {
        throw new Error(`No elements found for locator: ${locatorKey}`);
      }

      // Scroll to each element and attach a screenshot if capture is enabled
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        await element.evaluate((el) => {
          if (el instanceof HTMLElement) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          }
        });
      
        if (capture) {
          await captureScreenshot(page, `locator_index_${i}`, test.info());
        }
      }
      

      // Attach the number of indices to the report
      test.info().attachments.push({
        name: `Indices Count for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(`Total indices: ${elements.length}`),
      });

      // Return all indices as an array
      return elements.map((_, index) => index);
    });
  } catch (error: unknown) {
    // Catch error and handle it
    if (error instanceof Error) {
      console.error(`Test failed with error: ${error.message}`);
      await captureScreenshot(page, `indices_${locatorKey}_failure`, test.info());

      // Mark the test as failed with the error message
      test.fail(true, `Test failed with error: ${error.message}`);
      throw error;
    } else {
      console.error(`Test failed with unknown error: ${error}`);
      await captureScreenshot(page, `indices_${locatorKey}_failure`, test.info());
      test.fail(true, 'Unknown error occurred during the test');
      throw new Error('Unknown error occurred');
    }
  }
  // *** End of Get Indices Command *** [Date: 2024-12-26 10:31:00]
}


// Method to draw a signature dynamically with robust failure handling and proper reporting
static async drawSignature(
  page: Page,
  locatorKey: string,
  capture: boolean = false
) {
  const commandStartDate = new Date().toISOString();
  // *** Start of Draw Signature Command *** [Date: ${commandStartDate}]
  /*
    ********************************************
    ** Command: Draw Signature on Canvas **
    ** Action: Simulating signature drawing on canvas **
    ** Locator: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // Mark the test as failed and update the report
    const errorMessage = `Locator for ${locatorKey} not found.`;
    console.error(errorMessage);
    test.info().annotations.push({
      type: 'error',
      description: errorMessage,
    });
    if (capture) {
      await captureScreenshot(page, `draw_signature_${locatorKey}_missing_locator`, test.info());
    }
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  try {
    await test.step(`Attempt to draw signature on ${locatorKey}`, async () => {
      const canvas = page.locator(locatorValue);

      // Ensure the element exists and is visible
      if (!(await canvas.isVisible())) {
        const errorMessage = `Canvas element (${locatorKey}) is not visible on the page.`;
        console.error(errorMessage);
        test.info().annotations.push({
          type: 'error',
          description: errorMessage,
        });
        if (capture) {
          await captureScreenshot(page, `draw_signature_${locatorKey}_not_visible`, test.info());
        }
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }

      // Scroll to the canvas before interacting
      await canvas.evaluate((element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      });

      // Verify bounding box is retrievable
      const boundingBox = await canvas.boundingBox();
      if (!boundingBox) {
        const errorMessage = `Bounding box for canvas (${locatorKey}) could not be retrieved.`;
        console.error(errorMessage);
        test.info().annotations.push({
          type: 'error',
          description: errorMessage,
        });
        if (capture) {
          await captureScreenshot(page, `draw_signature_${locatorKey}_no_bounding_box`, test.info());
        }
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }

      const { x, y } = boundingBox;

      // Hardcoded signature path for drawing
      const signaturePath: [number, number][] = [
        [20, 30], [25, 32], [30, 34], [40, 35], [50, 40],
        [60, 45], [65, 42], [70, 38], [80, 30], [85, 28],
        [90, 32], [95, 36], [100, 40], [105, 44], [110, 38],
      ];

      // Move to the starting point
      const [startX, startY] = signaturePath[0];
      await page.mouse.move(x + startX, y + startY);
      await page.mouse.down();

      // Draw the signature by iterating over the path
      for (const [offsetX, offsetY] of signaturePath) {
        await page.mouse.move(x + offsetX, y + offsetY);
      }

      await page.mouse.up();

      // Attach a screenshot of the completed signature if capture flag is true
      if (capture) {
        await captureScreenshot(page, `draw_signature_${locatorKey}`, test.info());
      }

      // Update the report for successful execution
      test.info().attachments.push({
        name: `Signature drawn on ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from('Signature drawing completed successfully.'),
      });
    });
  } catch (error: unknown) {
    // Handle and log unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during the signature drawing';
    console.error(`Test failed with error: ${errorMessage}`);
    test.info().annotations.push({
      type: 'error',
      description: errorMessage,
    });
    if (capture) {
      await captureScreenshot(page, `draw_signature_${locatorKey}_failure`, test.info());
    }
    test.fail(true, `Test failed with error: ${errorMessage}`);
    throw new Error(errorMessage);
  }

  const commandEndDate = new Date().toISOString();
  // *** End of Draw Signature Command *** [Date: ${commandEndDate}]
}

static async uploadFile(
  page: Page,
  locatorKey: string,
  filePath: string,
  capture: boolean = false
) {
  // *** Start of Upload File Command *** [Date: ${new Date().toISOString()}]
  /*
    ********************************************
    ** Command: Upload File **
    ** Action: Uploading file from path: ${filePath} **
    ** Locator: ${locatorKey} **
    ********************************************
  */

  const locatorValue = resolveLocator(locatorKey, locators);

  if (!locatorValue) {
    // Mark the test as failed and capture screenshot
    const errorMessage = `Locator for ${locatorKey} not found.`;
    test.fail(true, errorMessage); // Fail the test explicitly
    throw new Error(errorMessage);
  }

  // Log the start of the action and execute the step
  try {
    await test.step(`Upload file to ${locatorKey} from path: ${filePath}`, async () => {
      const locator = page.locator(locatorValue);

      // Scroll to the locator before interacting
      await locator.evaluate((element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      });

      // Upload the file using setInputFiles
      await locator.setInputFiles(filePath);

      // Attach the file path to the report as an attachment
      test.info().attachments.push({
        name: `Uploaded File Path for ${locatorKey}`,
        contentType: 'text/plain',
        body: Buffer.from(filePath), // Attach the file path as evidence
      });

      // Capture and attach screenshot for this step if the capture flag is true
      if (capture) {
        await captureScreenshot(page, `upload_${locatorKey}`, test.info());
      }

      console.log(`File uploaded successfully to ${locatorKey}.`);
    });
  } catch (error: unknown) {
    // Catch error and handle it
    if (error instanceof Error) {
      // Log the error message and capture screenshot
      console.error(`Test failed with error: ${error.message}`);
      await captureScreenshot(page, `upload_${locatorKey}_failure`, test.info());

      // Mark the test as failed with the error message
      test.fail(true, `Test failed with error: ${error.message}`); // Explicitly fail the test
      throw error; // Re-throw the error to fail the test
    } else {
      // If the error is not an instance of Error, log it as unknown
      console.error(`Test failed with unknown error: ${error}`);
      await captureScreenshot(page, `upload_${locatorKey}_failure`, test.info());

      // Fail the test if an unknown error occurs
      test.fail(true, 'Unknown error occurred during the test');
      throw new Error('Unknown error occurred'); // Re-throw the error
    }
  }
  // *** End of Upload File Command *** [Date: ${new Date().toISOString()}]
}

static async waitForAllInstancesToDisappear(
  page: Page,
  locator: string, // XPath or CSS locator
  timeout: number = 5000, // Time to wait for each check
  retries: number = 3, // Number of retries
  capture: boolean = false // Capture screenshot on failure
): Promise<void> {
  console.log(`*** Start of Wait For All Instances To Disappear Command *** [Date: ${new Date().toISOString()}]`);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[INFO] Attempt ${attempt}/${retries}: Checking if all instances of locator "${locator}" are invisible.`);

      // Use waitForFunction to ensure all elements matching the locator are invisible
      await page.waitForFunction(
        async (selector) => {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const style = window.getComputedStyle(element as HTMLElement);
            if (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              (element as HTMLElement).offsetParent !== null
            ) {
              return false; // At least one element is still visible
            }
          }
          return true; // All elements are invisible
        },
        locator,
        { timeout }
      );

      console.log(`[INFO] All instances of locator "${locator}" are now invisible.`);
      test.info().attachments.push({
        name: `Locator Disappearance Success`,
        contentType: "text/plain",
        body: Buffer.from(`All instances of locator "${locator}" are invisible.`),
      });

      return; // Exit successfully as all instances are invisible
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error("Unknown error occurred.");
      console.error(`[ERROR] Attempt ${attempt}/${retries} failed: ${(lastError as Error).message}`);

      // Capture screenshot on failure
      if (capture) {
        await captureScreenshot(page, `waitForAllInstancesToDisappear_attempt_${attempt}_failure`, test.info());
      }

      // On the last retry, log and re-throw the error
      if (attempt === retries) {
        const finalErrorMessage = `Failed to wait for all instances of locator "${locator}" to disappear after ${retries} attempts.`;
        console.error(`[ERROR] ${finalErrorMessage}`);
        test.info().attachments.push({
          name: `Locator Disappearance Failure`,
          contentType: "text/plain",
          body: Buffer.from(finalErrorMessage),
        });

        if (capture) {
          await captureScreenshot(page, `waitForAllInstancesToDisappear_final_failure`, test.info());
        }

        throw lastError;
      }

      // Wait before retrying
      console.log(`[INFO] Waiting before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`*** End of Wait For All Instances To Disappear Command ***`);
}

static async hardPause(
  page: Page,
  duration: number, // Pause duration in milliseconds
  capture: boolean = true, // Enable screenshot capture on failure
  description: string = 'Hard pause' // Optional description for the pause
): Promise<void> {
  // Validate duration
  if (duration <= 0) {
    const errorMessage = `Invalid duration: ${duration}ms. Duration must be greater than 0.`;
    console.error(`[ERROR] ${errorMessage}`);
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  // Perform the hard pause
  try {
    await test.step(`${description} for ${duration}ms`, async () => {
      console.log(`[INFO] Starting ${description} for ${duration}ms.`);

      // Wait for the specified duration
      await new Promise((resolve) => setTimeout(resolve, duration));

      console.log(`[INFO] Completed ${description} for ${duration}ms.`);

      // Optionally capture a screenshot after the pause
      if (capture) {
        await captureScreenshot(page, `hard_pause_${duration}`, test.info());
      }
    });
  } catch (error: unknown) {
    // Handle errors during the pause
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred during the hard pause.';
    console.error(`[ERROR] ${errorMessage}`);

    // Capture a failure screenshot
    if (capture) {
      await captureScreenshot(page, `hard_pause_${duration}_failure`, test.info());
    }

    // Fail the test and re-throw the error
    test.fail(true, `Test failed during hard pause: ${errorMessage}`);
    throw error instanceof Error ? error : new Error(errorMessage);
  }
}

/**
 * Generates an appointment number starting with "14" and random remaining digits.
 * Ensures the number is 7 digits long.
 * @returns Random appointment number as a string.
 */
static async generateAppointmentNumber(): Promise<string> {
  const fixedStart = "14"; // Fixed starting digits
  const remainingDigits = 5; // Total number of digits needed after the fixed start

  let randomPart = ""; // Placeholder for random digits
  for (let i = 0; i < remainingDigits; i++) {
    randomPart += Math.floor(Math.random() * 10).toString(); // Generate a random digit (0-9)
  }

  return fixedStart + randomPart; // Combine fixed start with the random part
}

static async selectIframe(
  page: Page,
  iframeLocatorKey: string,
  elementLocatorInsideIframeKey: string, // Key for the element inside iframe
  capture: boolean = false
): Promise<Frame | null> {
  // Resolve the iframe locator value
  const iframeLocatorValue = resolveLocator(iframeLocatorKey, locators);

  // Resolve the element locator inside the iframe
  const elementLocatorInsideIframe = resolveLocator(elementLocatorInsideIframeKey, locators);

  // Fail the test if the iframe locator is not found
  if (!iframeLocatorValue) {
    const errorMessage = `Locator not found for iframe key: "${iframeLocatorKey}".`;
    console.error(errorMessage);
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  // Fail the test if the element locator inside iframe is not found
  if (!elementLocatorInsideIframe) {
    const errorMessage = `Locator not found for element inside iframe key: "${elementLocatorInsideIframeKey}".`;
    console.error(errorMessage);
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  try {
    // Select the iframe element
    await test.step(`Select the iframe "${iframeLocatorKey}"`, async () => {
      const iframeElement = page.locator(iframeLocatorValue);

      // Wait for the iframe element to be visible
      await iframeElement.waitFor({ state: 'visible', timeout: 5000 });

      // Get the content frame (iframe reference)
      const iframe = await iframeElement.contentFrame();

      if (iframe) {
        console.log(`Iframe "${iframeLocatorKey}" selected successfully.`);

        // Wait for the specific element inside the iframe to be visible
        await iframe.locator(elementLocatorInsideIframe).waitFor({ state: 'visible', timeout: 5000 });
        console.log('Iframe content is fully loaded and interactable.');

        // Capture screenshot if capture is true
        if (capture) {
          await captureScreenshot(page, `select_iframe_${iframeLocatorKey}`, test.info());
        }

        return iframe; // Return iframe reference for further interaction
      } else {
        const errorMessage = `Failed to retrieve the iframe content for "${iframeLocatorKey}".`;
        console.error(errorMessage);
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }
    });
  } catch (error: unknown) {
    // Handle errors during the select iframe action
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred during iframe selection.';
    console.error(`Test failed with error: ${errorMessage}`);

    // Capture screenshot on failure
    if (capture) {
      await captureScreenshot(page, `select_iframe_${iframeLocatorKey}_failure`, test.info());
    }

    // Fail the test and re-throw the error
    test.fail(true, `Test failed with error: ${errorMessage}`);
    throw error instanceof Error ? error : new Error(errorMessage);
  }

  // Ensure the function always returns a value
  return null; // Return null if no iframe was found
}

static async clickInsideIframe(
  page: Page,
  iframeLocatorKey: string,
  elementLocatorInsideIframeKey: string, // Key for the element inside iframe
  capture: boolean = false
): Promise<Frame | null> {
  // Resolve the iframe locator value
  const iframeLocatorValue = resolveLocator(iframeLocatorKey, locators);

  // Resolve the element locator inside the iframe
  const elementLocatorInsideIframe = resolveLocator(elementLocatorInsideIframeKey, locators);

  // Fail the test if the iframe locator is not found
  if (!iframeLocatorValue) {
    const errorMessage = `Locator not found for iframe key: "${iframeLocatorKey}".`;
    console.error(errorMessage);
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  // Fail the test if the element locator inside iframe is not found
  if (!elementLocatorInsideIframe) {
    const errorMessage = `Locator not found for element inside iframe key: "${elementLocatorInsideIframeKey}".`;
    console.error(errorMessage);
    test.fail(true, errorMessage);
    throw new Error(errorMessage);
  }

  try {
    // Select the iframe element
    await test.step(`Select the iframe "${iframeLocatorKey}"`, async () => {
      const iframeElement = page.locator(iframeLocatorValue);

      // Wait for the iframe element to be visible
      await iframeElement.waitFor({ state: 'visible', timeout: 5000 });

      // Get the content frame (iframe reference)
      const iframe = await iframeElement.contentFrame();

      if (iframe) {
        console.log(`Iframe "${iframeLocatorKey}" selected successfully.`);

        // Wait for the specific element inside the iframe to be visible
        const elementHandleInsideIframe = iframe.locator(elementLocatorInsideIframe);
        await elementHandleInsideIframe.waitFor({ state: 'visible', timeout: 5000 });
        console.log('Iframe content is fully loaded and interactable.');
        // Click on the element inside the iframe
        await elementHandleInsideIframe.click();
        console.log(`Clicked on the element "${elementLocatorInsideIframeKey}" inside the iframe.`);

        // Capture screenshot if capture is true
        if (capture) {
          await captureScreenshot(page, `click_inside_iframe_${iframeLocatorKey}`, test.info());
        }

        return iframe; // Return iframe reference for further interaction
      } else {
        const errorMessage = `Failed to retrieve the iframe content for "${iframeLocatorKey}".`;
        console.error(errorMessage);
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }
    });
  } catch (error: unknown) {
    // Handle errors during the select iframe action
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred during iframe selection.';
    console.error(`Test failed with error: ${errorMessage}`);

    // Capture screenshot on failure
    if (capture) {
      await captureScreenshot(page, `click_inside_iframe_${iframeLocatorKey}_failure`, test.info());
    }

    // Fail the test and re-throw the error
    test.fail(true, `Test failed with error: ${errorMessage}`);
    throw error instanceof Error ? error : new Error(errorMessage);
  }

  // Ensure the function always returns a value
  return null; // Return null if no iframe was found
}



static async deselectIframe(page: Page, capture: boolean = false): Promise<void> {
  try {
    // Step to return to the main page context (deselect iframe)
    await test.step('Deselect iframe and return to main page context', async () => {
      // Switch back to the main frame (top frame)
      const mainFrame = page.mainFrame();

      if (mainFrame) {
        console.log('Returned to main page context successfully.');

        // Capture screenshot if capture is true
        if (capture) {
          await captureScreenshot(page, 'deselect_iframe', test.info());
        }
      } else {
        const errorMessage = 'Failed to switch back to the main page context.';
        console.error(errorMessage);
        test.fail(true, errorMessage);
        throw new Error(errorMessage);
      }
    });
  } catch (error: unknown) {
    // Handle errors during the deselect iframe action
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred during iframe deselection.';
    console.error(`Test failed with error: ${errorMessage}`);

    // Capture screenshot on failure
    if (capture) {
      await captureScreenshot(page, 'deselect_iframe_failure', test.info());
    }

    // Fail the test and re-throw the error
    test.fail(true, `Test failed with error: ${errorMessage}`);
    throw error instanceof Error ? error : new Error(errorMessage);
  }
}

}