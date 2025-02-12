import { test, BrowserContext, Page } from '@playwright/test';
import { LIB_Common } from '../Libraries/LIB_Common';
import { DataHelper } from '../Runtime/Helpers/DataHelper';
import { loadGlobalConfig } from '../Runtime/Helpers/ConfigHelper';
import fs from 'fs';
import path from 'path';
import { BedEnquiryandGetVacanBed,handleRequestForAdmsionNewPartOne, handleRequestForAdmsionPartTwo } from '../Libraries/LIB_HelperRequestAdmission';
import { handlePatientRegistration } from '../Libraries/LIB_HelperPatientRegistration';

const { username, password } = loadGlobalConfig();
const WAIT_TIME = 8000;
const SHORT_WAIT_TIME = 3000;
const CONFIG_PATH = path.join(__dirname, '../TestPlans', 'testConfig.json');

// Define the TestCase interface
interface DataTableConfig {
  name: string;
  pickIndex: number;
}

interface TestCase {
  testCaseID: string;
  testCaseName: string;
  testName: string;
  specFile: string;
  iterationCount: number;
  execute: boolean;
  dataTables: DataTableConfig[];
}

// Load the configuration file
if (!fs.existsSync(CONFIG_PATH)) {
  throw new Error(`Configuration file not found at path: ${CONFIG_PATH}`);
}

const config: { testCases: TestCase[] } = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const currentSpecFile = 'CreateRequestForAdmission.spec.ts';

// Filter test cases
const createRFA = config.testCases.filter(
  (tc) => tc.specFile === currentSpecFile && tc.testName === 'Create Request For Admission' && tc.execute
);

test.describe('Create Request For Admission', () => {
  for (const testCase of createRFA) {
    const { testCaseID, testCaseName, iterationCount, dataTables } = testCase;

    // Load data tables
    const loadedDataTables = dataTables.map(({ name, pickIndex }) => {
      const data = DataHelper.loadData(`./${name}`);
      return data[pickIndex];
    });

    for (let iteration = 1; iteration <= iterationCount; iteration++) {
      const dynamicTestName = `${testCaseID} - ${testCaseName.replace('{iteration}', iteration.toString())}`;

      test(dynamicTestName, async ({ browser }) => {
        const context: BrowserContext = await browser.newContext();
        await context.clearCookies();
        const page: Page = await context.newPage();

        try {
          console.log(`Starting test: ${dynamicTestName}`);

          const dt_requestForAdmission = loadedDataTables[0];
          const dt_outPatientRegistrationNew = loadedDataTables[1];

          // Common test steps
          await LIB_Common.bc_OpenUrl(page, dt_outPatientRegistrationNew.url, dt_outPatientRegistrationNew.urlExpected);
          await LIB_Common.bc_Login(page, dt_outPatientRegistrationNew.country, WAIT_TIME);
          await LIB_Common.bc_MicrosoftLogin(page, username, password, WAIT_TIME);
          await LIB_Common.bc_ProceedWelcome(
            page,
            dt_outPatientRegistrationNew.welcomeMessage,
            dt_outPatientRegistrationNew.urlWelcomeMY,
            dt_outPatientRegistrationNew.country,
            dt_outPatientRegistrationNew.hospital,
            dt_outPatientRegistrationNew.department,
            WAIT_TIME
          );
          await LIB_Common.bc_HandelMainNavigationLinkClick(page, dt_outPatientRegistrationNew.mainnavgationname, SHORT_WAIT_TIME);
          await LIB_Common.bc_HandelSubNavigationLinkClick(page, dt_outPatientRegistrationNew.subnavgationname, WAIT_TIME);
          
          // Patient registration steps
          await handlePatientRegistration(page, dt_outPatientRegistrationNew, dataTables);
          if(dt_requestForAdmission.isPartTwo){
          await BedEnquiryandGetVacanBed(page, dt_requestForAdmission,dataTables);
          }
          await handleRequestForAdmsionNewPartOne(page,dt_requestForAdmission,dt_outPatientRegistrationNew,dataTables);
          await handleRequestForAdmsionPartTwo(page,dt_requestForAdmission,dataTables);
          await LIB_Common.bc_LogOut(page);
          console.log(`Test completed successfully: ${dynamicTestName}`);
        } catch (error: unknown) {
          console.error(`Test failed for: ${dynamicTestName} with error: ${(error as Error).message}`);
        } finally {
          await context.close();
        }
      });
    }
  }
});


