import { test, BrowserContext, Page } from '@playwright/test';
import { LIB_Common } from '../Libraries/LIB_Common';
import { DataHelper } from '../Runtime/Helpers/DataHelper';
import { loadGlobalConfig} from '../Runtime/Helpers/ConfigHelper';
import { LIB_PatientRegistration } from '../Libraries/LIB_PatientRegistration';
import fs from 'fs';
import path from 'path';
import { BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';
import { LIB_Appointment } from '../Libraries/LIB_Appointment';


const { username, password } = loadGlobalConfig();
// Define the TestCase interface
interface TestCase {
  testCaseID: string; 
  testCaseName: string;
  testName: string;
  specFile: string;
  pickIndex: number;
  iterationCount: number;
  execute: boolean;
  dataTable?: string;
}

// Load the configuration file
const configPath = path.join(__dirname, '../TestPlans', 'testConfig.json');
if (!fs.existsSync(configPath)) {
  throw new Error(`Configuration file not found at path: ${configPath}`);
}

const config: { testCases: TestCase[] } = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Identify the spec file this script belongs to
const currentSpecFile = 'outpatientRegistration.spec.ts';

// Test cases matching `Outpatient Registration`
const outpatientRegistrationNew = config.testCases.filter(
  tc => tc.specFile === currentSpecFile && tc.testName === 'Outpatient Registration New' && tc.execute
);

// Test cases matching `Outpatient Registration`
const outpatientRegistrationNewTwin = config.testCases.filter(
  tc => tc.specFile === currentSpecFile && tc.testName === 'Outpatient Registration New Twin Patient' && tc.execute
);


// Test cases matching `Outpatient Registration Existing`
const outpatientRegistrationExisting = config.testCases.filter(
  tc => tc.specFile === currentSpecFile && tc.testName === 'Outpatient Registration Existing' && tc.execute
);

test.describe('Outpatient Registration New', () => {
  for (const testCase of outpatientRegistrationNew) {
    const { testCaseID, testCaseName, pickIndex, iterationCount, dataTable } = testCase;

    // Dynamically load the data table
    const dataTablePath = dataTable || 'dt_outPatientRegistrationNew';
    const dt_outPatientRegistrationNew_table = DataHelper.loadData(`./${dataTablePath}`);
    const dt_outPatientRegistrationNew = dt_outPatientRegistrationNew_table[pickIndex];

    for (let iteration = 1; iteration <= iterationCount; iteration++) {
      const dynamicTestName = `${testCaseID} - ${testCaseName.replace('{iteration}', iteration.toString())}`;

      test(dynamicTestName, async ({ browser }) => {
        const context: BrowserContext = await browser.newContext();
        await context.clearCookies();
        const page: Page = await context.newPage();

        try {
          console.log(`Starting test: ${dynamicTestName}`);

          // Common test steps
          await LIB_Common.bc_OpenUrl(page, dt_outPatientRegistrationNew.url, dt_outPatientRegistrationNew.urlExpected);
          await LIB_Common.bc_Login(page, dt_outPatientRegistrationNew.country, 8000);
          await LIB_Common.bc_MicrosoftLogin(page, username, password, 8000);
          await LIB_Common.bc_ProceedWelcome(
            page,
            dt_outPatientRegistrationNew.welcomeMessage,
            dt_outPatientRegistrationNew.urlWelcomeMY,
            dt_outPatientRegistrationNew.country,
            dt_outPatientRegistrationNew.hospital,
            dt_outPatientRegistrationNew.department,
            8000
          );
          await handleOutPatientRegistration(page,dt_outPatientRegistrationNew,dataTablePath,pickIndex);
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


test.describe('Outpatient Registration Existing', () => {
  for (const testCase of outpatientRegistrationExisting) {
    const { testCaseID, testCaseName, pickIndex, iterationCount, dataTable } = testCase;

    // Dynamically load the data table
    const dataTablePath = dataTable || 'dt_outPatientRegistrationExisting';
    const dt_outPatientRegistrationExisting_table = DataHelper.loadData(`./${dataTablePath}`);
    const dt_outPatientRegistrationExisting = dt_outPatientRegistrationExisting_table[pickIndex];

    for (let iteration = 1; iteration <= iterationCount; iteration++) {
      const dynamicTestName = `${testCaseID} - ${testCaseName.replace('{iteration}', iteration.toString())}`;

      test(dynamicTestName, async ({ browser }) => {
        const context: BrowserContext = await browser.newContext();
        await context.clearCookies();
        const page: Page = await context.newPage();

        try {
          console.log(`Starting test: ${dynamicTestName}`);

          // Common test steps
          await LIB_Common.bc_OpenUrl(page, dt_outPatientRegistrationExisting.url, dt_outPatientRegistrationExisting.urlExpected);
          await LIB_Common.bc_Login(page, dt_outPatientRegistrationExisting.country, 8000);
          await LIB_Common.bc_MicrosoftLogin(page, username, password, 8000);
          await LIB_Common.bc_ProceedWelcome(
            page,
            dt_outPatientRegistrationExisting.welcomeMessage,
            dt_outPatientRegistrationExisting.urlWelcomeMY,
            dt_outPatientRegistrationExisting.country,
            dt_outPatientRegistrationExisting.hospital,
            dt_outPatientRegistrationExisting.department,
            8000
          );
          await LIB_Common.bc_HandelMainNavigationLinkClick(page, dt_outPatientRegistrationExisting.mainnavgationname, 3000);
          await LIB_Common.bc_HandelSubNavigationLinkClick(page, dt_outPatientRegistrationExisting.subnavgationname, 8000);

          // Patient registration steps
          await LIB_PatientRegistration.bc_VerifyPageNavigation(
            page,
            dt_outPatientRegistrationExisting.registrationheader,
            dt_outPatientRegistrationExisting.registration_url,
            8000
          );
          
          await LIB_PatientRegistration.bc_HandleOutPatientRegistrationType(page, dt_outPatientRegistrationExisting.careTypes, 3000);
          await LIB_PatientRegistration.bc_VerifyRegistrationPatientField(page, 3000);
          await LIB_PatientRegistration.bc_HandleMrnSearchWithoutVisitNumber(page,dt_outPatientRegistrationExisting.mrnInputManually,dt_outPatientRegistrationExisting.patientMrn,'MyKAD');
          await LIB_PatientRegistration.bc_HandleStoreExistingPatientInfo(page,dataTablePath,pickIndex);
          await LIB_PatientRegistration.bc_HandleAdditionalPatientDetailsExpandSection(page);
          await LIB_PatientRegistration.bc_HandleStoreExistingAdditionalPatientDetails(page,dataTablePath,pickIndex);
          await LIB_PatientRegistration.bc_HandleVisitAdmissionDetailsExpandSection(page);
          await LIB_PatientRegistration.bc_HandleStoreExistingVisitAdmissionDetails(page,dataTablePath,pickIndex);
          await LIB_PatientRegistration.bc_HandleEmergencyContactDetailsExpandSection(page);
          await LIB_PatientRegistration.bc_HandleStoreExistingEmergencyContactDetails(page,dataTablePath,pickIndex);
          await LIB_PatientRegistration.bc_HandleExistingPatientPatientInfoMandetoryFields(page,
            dt_outPatientRegistrationExisting.expectedIdentificationType,
            dt_outPatientRegistrationExisting.gender,
            dt_outPatientRegistrationExisting.nicType,
            dt_outPatientRegistrationExisting.expectedCountryofIssueexpected, 
            dt_outPatientRegistrationExisting.expectedNationality,
            dt_outPatientRegistrationExisting.expectedRace,
            dt_outPatientRegistrationExisting.expectedEmail,
            dataTablePath,
            pickIndex);
          await LIB_PatientRegistration.bc_HandleEditExistingVisitAdmissionDetails(
            page,
            dt_outPatientRegistrationExisting.expectedPatientType,
            dt_outPatientRegistrationExisting.expectedPrivateCategory,
            dt_outPatientRegistrationExisting.isPrivilege,
            dt_outPatientRegistrationExisting.expectedPrivilege,
            dt_outPatientRegistrationExisting.privilageRemark,
            dt_outPatientRegistrationExisting.corporateName,
            dt_outPatientRegistrationExisting.creditLimitExceeded,
            dt_outPatientRegistrationExisting.creditBalanceLimit,
            dt_outPatientRegistrationExisting.amount,
            dt_outPatientRegistrationExisting.coGarantor,
            dt_outPatientRegistrationExisting.isReferredByClinic,
            dt_outPatientRegistrationExisting.clinicName,
            dataTablePath,
            pickIndex,
            3000
          );
          await LIB_PatientRegistration.bc_HandleExistingEmergencyContactDetailsMandetoryFields(page,
            dt_outPatientRegistrationExisting.expectedGenderEmergencyContact,
            dt_outPatientRegistrationExisting.expectedRelationType,
            dt_outPatientRegistrationExisting.expectedGenderEmergencyContact,
            dt_outPatientRegistrationExisting.nicType,
            dt_outPatientRegistrationExisting.emergencyExpectedStreet1,
            dt_outPatientRegistrationExisting.emergencyExpectedStreet2,
            dt_outPatientRegistrationExisting.emergencyExpectedStreet3,
            dt_outPatientRegistrationExisting.emergencyExpectedStreet4,
            dt_outPatientRegistrationExisting.emergencyExpectedCountry,
            dt_outPatientRegistrationExisting.emergencyExpectedState,
            dt_outPatientRegistrationExisting.emergencyExpectedTown,
            dt_outPatientRegistrationExisting.emergencyExpectedPostalCode,
            dataTablePath,
            pickIndex
          );
          const isGuardianEnable = await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.card_collapseguardian',dt_outPatientRegistrationExisting.wait,'soft');
          if(isGuardianEnable){
            const updatedData = DataHelper.reloadData(dataTablePath);
            await LIB_PatientRegistration.bc_HandleGuardianDetailsExpandSection(page);
            await LIB_PatientRegistration.bc_HandleGuardianDetails(
              page,
              dt_outPatientRegistrationExisting.isGuardianMrn,
              dt_outPatientRegistrationExisting.guardianMrn,
              dt_outPatientRegistrationExisting.isSameAsEmergencyDetails,
              updatedData[pickIndex].street1Relation,
              updatedData[pickIndex].street2Relation,
              updatedData[pickIndex].street3Relation,
              updatedData[pickIndex].street4Relation,
              updatedData[pickIndex].countryRelation,
              updatedData[pickIndex].stateRelation,
              updatedData[pickIndex].townRelation,
              updatedData[pickIndex].postcodeRelation,
              updatedData[pickIndex].relationCountryCode,
              updatedData[pickIndex].relationMobileNumber,
              updatedData[pickIndex].relationRetrievCountryCode,
              dt_outPatientRegistrationExisting.guardianStreet1,
              dt_outPatientRegistrationExisting.guardianCountry,
              dt_outPatientRegistrationExisting.guardianState,
              dt_outPatientRegistrationExisting.guardianCity,
              dataTablePath,
              pickIndex,
              dt_outPatientRegistrationExisting.wait);
          }
          
          await LIB_PatientRegistration.bc_HandleClickonRegisterButton(page, dt_outPatientRegistrationExisting.isNewBorn);
          await LIB_PatientRegistration.bc_HandleStoreMrnandVisitNo(page, dataTablePath, pickIndex);
          await LIB_PatientRegistration.bc_VerifyExistingPatientRegistrationDetailsinVisitAdmission(page, 
            dt_outPatientRegistrationExisting.isPrivilege, 
            dt_outPatientRegistrationExisting.expectedPrivilegeType, 
            dt_outPatientRegistrationExisting.expectedPrivilageRemark, 
            dataTablePath, 
            pickIndex);
          await LIB_PatientRegistration.bc_VerifyExistingPatientRegistrationDetailsinEmergencyContact(page,dataTablePath,pickIndex);
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




async function handleOutPatientRegistration(
  page: Page,
  dt_outPatientRegistrationNew: any,
  dataTablePath: string,
  pickIndex: number
) {
  // Determine the number of iterations
  const iterations =
      dt_outPatientRegistrationNew.isTwinFirst && dt_outPatientRegistrationNew.isTwinSecond
          ? 2 // Both true: Two iterations
          : 1; // Either one is true or both are false: One iteration

  for (let i = 0; i < iterations; i++) {
      console.log(`Iteration ${i + 1} started.`);
      
      await LIB_Common.bc_HandelMainNavigationLinkClick(page, dt_outPatientRegistrationNew.mainnavgationname, 3000);
      await LIB_Common.bc_HandelSubNavigationLinkClick(page, dt_outPatientRegistrationNew.subnavgationname, 8000);

      // Patient registration steps
      await LIB_PatientRegistration.bc_VerifyPageNavigation(
          page,
          dt_outPatientRegistrationNew.registrationheader,
          dt_outPatientRegistrationNew.registration_url,
          8000
      );

      await LIB_PatientRegistration.bc_HandleChargeType(
          page,
          dt_outPatientRegistrationNew.chargeTypeLabel,
          dt_outPatientRegistrationNew.chargeType,
          6000
      );

      // Shared data object
      const sharedData: any = {};
      if (dt_outPatientRegistrationNew.isAppoitnment) {
          const {
              icNo,
              appointmentId,
              patientName,
              birthDate,
              mobileNumber,
              age
          } = await LIB_Appointment.bc_AddAppoinmentAPI(
              page,
              dt_outPatientRegistrationNew.genders,
              dt_outPatientRegistrationNew.nicType,
              'patientNic',
              'dob',
              'age',
              'patientMobileNo',
              dt_outPatientRegistrationNew.appointmentTime,
              dt_outPatientRegistrationNew.appointmentSlot,
              'patientName',
              dt_outPatientRegistrationNew.doctorCode,
              dt_outPatientRegistrationNew.email,
              dataTablePath,
              pickIndex,
              'https://sitmcare21.columbiaasia.com/api/appointmentapi/AppointmentAPI/AddAppointmentSchedule'
          );

          // Store data in sharedData object
          sharedData.patientName = patientName;
          sharedData.appointmentId = appointmentId;
          sharedData.icNo = icNo;
          sharedData.age = age;
          sharedData.mobileNumber = mobileNumber;
      }

      await LIB_PatientRegistration.bc_HandleOutPatientRegistrationType(page, dt_outPatientRegistrationNew.careTypes, 3000);
      await LIB_PatientRegistration.bc_VerifyRegistrationPatientField(page, 3000);
      await LIB_PatientRegistration.bc_HandleInputName(page, dt_outPatientRegistrationNew.isAppoitnment, dataTablePath, pickIndex, 3000);

      // Patient Info
      await LIB_PatientRegistration.bc_HandleFillPatientInfo(
          page,
          dt_outPatientRegistrationNew.identificationType,
          dt_outPatientRegistrationNew.genders,
          dt_outPatientRegistrationNew.countryofIssue,
          dt_outPatientRegistrationNew.nationality,
          dt_outPatientRegistrationNew.race,
          dt_outPatientRegistrationNew.genders,
          dt_outPatientRegistrationNew.countryCode,
          dt_outPatientRegistrationNew.nonMyKadInformation,
          dt_outPatientRegistrationNew.email,
          dt_outPatientRegistrationNew.nicType,
          dt_outPatientRegistrationNew.isNewBorn,
          dt_outPatientRegistrationNew.needPatientRemark,
          dt_outPatientRegistrationNew.addPatientRemark,
          dt_outPatientRegistrationNew.isAppoitnment,
          sharedData.icNo,
          sharedData.appointmentId,
          sharedData.age,
          sharedData.mobileNumber,
          dt_outPatientRegistrationNew.email,
          sharedData.patientName,
          dt_outPatientRegistrationNew.isTwinFirst,
          dt_outPatientRegistrationNew.isTwinSecond,
          'patientNic',
          'DOB',
          'patientMobileNo',
          dataTablePath,
          pickIndex,
          3000
      );

      // Additional Details
      await LIB_PatientRegistration.bc_HandleAditionalPatientDetails(
          page,
          dt_outPatientRegistrationNew.religion,
          dt_outPatientRegistrationNew.maritalstatus,
          dt_outPatientRegistrationNew.occupation,
          dt_outPatientRegistrationNew.countryCode,
          dt_outPatientRegistrationNew.street1,
          dt_outPatientRegistrationNew.street2,
          dt_outPatientRegistrationNew.street3,
          dt_outPatientRegistrationNew.street4,
          dt_outPatientRegistrationNew.countryAditionalInfo,
          dt_outPatientRegistrationNew.state,
          dt_outPatientRegistrationNew.town,
          dt_outPatientRegistrationNew.postalCode,
          dataTablePath,
          pickIndex,
          3000
      );

      // Visit Details
      await LIB_PatientRegistration.bc_HandleVisitAdmissionDetails(
          page,
          dt_outPatientRegistrationNew.isAppoitnment,
          dt_outPatientRegistrationNew.patientType,
          dt_outPatientRegistrationNew.privateCategory,
          dt_outPatientRegistrationNew.isPrivilege,
          dt_outPatientRegistrationNew.privilageType,
          dt_outPatientRegistrationNew.privilageRemark,
          dt_outPatientRegistrationNew.corporateName,
          dt_outPatientRegistrationNew.creditLimitExceeded,
          dt_outPatientRegistrationNew.creditBalanceLimit,
          dt_outPatientRegistrationNew.amount,
          dt_outPatientRegistrationNew.coGarantor,
          dt_outPatientRegistrationNew.isReferredByClinic,
          dt_outPatientRegistrationNew.clinicName,
          dataTablePath,
          pickIndex,
          3000
      );

      // Emergency Contact
      await LIB_PatientRegistration.bc_HandleEmergencyContactDetails(
          page,
          dt_outPatientRegistrationNew.genderEmergencyContact,
          dt_outPatientRegistrationNew.relationType,
          dt_outPatientRegistrationNew.isSamePatientAddress,
          dt_outPatientRegistrationNew.street1Relation,
          dt_outPatientRegistrationNew.street2Relation,
          dt_outPatientRegistrationNew.street3Relation,
          dt_outPatientRegistrationNew.street4Relation,
          dt_outPatientRegistrationNew.countryRelation,
          dt_outPatientRegistrationNew.stateRelation,
          dt_outPatientRegistrationNew.townRelation,
          dt_outPatientRegistrationNew.postcodeRelation,
          dt_outPatientRegistrationNew.relationCountryCode,
          dataTablePath,
          pickIndex,
          3000
      );
      if (dt_outPatientRegistrationNew.isAddNewContact){
        await LIB_PatientRegistration.bc_HandleAddNewContactExpandSection(page);
        await LIB_PatientRegistration.bc_HandleAddNewContact(page,
          dt_outPatientRegistrationNew.genderEmergencyContact,
          dt_outPatientRegistrationNew.relationType,
          dt_outPatientRegistrationNew.nicType,
          dt_outPatientRegistrationNew.street1Relation,
          dt_outPatientRegistrationNew.street2Relation,
          dt_outPatientRegistrationNew.street3Relation,
          dt_outPatientRegistrationNew.street4Relation,
          dt_outPatientRegistrationNew.countryRelation,
          dt_outPatientRegistrationNew.stateRelation,
          dt_outPatientRegistrationNew.townRelation,
          dt_outPatientRegistrationNew.postcodeRelation,
          dt_outPatientRegistrationNew.relationCountryCode,
          dataTablePath,
          pickIndex,
        );
      }
      // Handle Guardian
      const isGuardianEnable = await BaseCommandCaller.isLocatorPresent(
          page,
          'PG_PatientRegistration.card_collapseguardian',
          dt_outPatientRegistrationNew.wait,
          'soft'
      );

      if (isGuardianEnable) {
          await LIB_PatientRegistration.bc_HandleGuardianDetailsExpandSection(page);
          await LIB_PatientRegistration.bc_HandleGuardianDetails(
              page,
              dt_outPatientRegistrationNew.isGuardianMrn,
              dt_outPatientRegistrationNew.guardianMrn,
              dt_outPatientRegistrationNew.isSameAsEmergencyDetails,
              dt_outPatientRegistrationNew.street1Relation,
              dt_outPatientRegistrationNew.street2Relation,
              dt_outPatientRegistrationNew.street3Relation,
              dt_outPatientRegistrationNew.street4Relation,
              dt_outPatientRegistrationNew.countryRelation,
              dt_outPatientRegistrationNew.stateRelation,
              dt_outPatientRegistrationNew.townRelation,
              dt_outPatientRegistrationNew.postcodeRelation,
              dt_outPatientRegistrationNew.relationCountryCode,
              dt_outPatientRegistrationNew.relationMobileNumber,
              dt_outPatientRegistrationNew.relationRetrievCountryCode,
              dt_outPatientRegistrationNew.guardianStreet1,
              dt_outPatientRegistrationNew.guardianCountry,
              dt_outPatientRegistrationNew.guardianState,
              dt_outPatientRegistrationNew.guardianCity,
              dataTablePath,
              pickIndex,
              dt_outPatientRegistrationNew.wait
          );
      }

      // Finalize Registration
      await LIB_PatientRegistration.bc_HandleClickonRegisterButton(page, dt_outPatientRegistrationNew.isNewBorn);
      await LIB_PatientRegistration.bc_HandleStoreMrnandVisitNo(page, dataTablePath, pickIndex);

      if(dt_outPatientRegistrationNew.isEdit){
        await LIB_PatientRegistration.bc_HandleAddNewContactExpandSection(page);
        await LIB_PatientRegistration.bc_HandleAddNewContact(page,
          dt_outPatientRegistrationNew.genderEmergencyContact,
          dt_outPatientRegistrationNew.relationType,
          dt_outPatientRegistrationNew.nicType,
          dt_outPatientRegistrationNew.street1,
          dt_outPatientRegistrationNew.street2,
          dt_outPatientRegistrationNew.street3,
          dt_outPatientRegistrationNew.street4,
          dt_outPatientRegistrationNew.countryAditionalInfo,
          dt_outPatientRegistrationNew.state,
          dt_outPatientRegistrationNew.town,
          dt_outPatientRegistrationNew.postalCode,
          dt_outPatientRegistrationNew.relationCountryCode,
          dataTablePath,
          pickIndex,
        );
      }
      if(dt_outPatientRegistrationNew.isTwinFirst && dt_outPatientRegistrationNew.isTwinSecond){
        LIB_PatientRegistration.bc_HandClearDataNav(page);
        await LIB_Common.bc_HandelMainNavigationLinkClick(page, dt_outPatientRegistrationNew.mainnavgationname, 3000);
      }


      console.log(`Iteration ${i + 1} completed.`);
  }
}
