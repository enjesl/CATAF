import { Page } from '@playwright/test';
import { LIB_Common } from './LIB_Common';
import { DataHelper } from '../Runtime/Helpers/DataHelper';
import { BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';
import { LIB_PatientRegistration } from './LIB_PatientRegistration';
import { LIB_Appointment } from './LIB_Appointment';


const WAIT_TIME = 8000;
const SHORT_WAIT_TIME = 3000;

// Define the TestCase interface
interface DataTableConfig {
    name: string;
    pickIndex: number;
}

/**
 * Handles the patient registration process.
 * 
 * @param {Page} page - The Playwright page object.
 * @param {any} dt_outPatientRegistrationNew - Data table containing new outpatient registration details.
 * @param {DataTableConfig[]} dataTables - Array of data table configurations.
 * 
 * @example
 * ```typescript
 * await handlePatientRegistration(page, dt_outPatientRegistrationNew, dataTables);
 * ```
 */
export async function handlePatientRegistration(page: Page, dt_outPatientRegistrationNew: any, dataTables: DataTableConfig[]) {
    // Verify page navigation
    await LIB_PatientRegistration.bc_VerifyPageNavigation(
      page,
      dt_outPatientRegistrationNew.registrationheader,
      dt_outPatientRegistrationNew.registration_url,
      WAIT_TIME
    );
    // Handle charge type
    await LIB_PatientRegistration.bc_HandleChargeType(
      page,
      dt_outPatientRegistrationNew.chargeTypeLabel,
      dt_outPatientRegistrationNew.chargeType,
      SHORT_WAIT_TIME
    );
  
    // Handle outpatient registration type
    await LIB_PatientRegistration.bc_HandleOutPatientRegistrationType(page, dt_outPatientRegistrationNew.careTypes, SHORT_WAIT_TIME);
  
    // Verify registration patient field
    await LIB_PatientRegistration.bc_VerifyRegistrationPatientField(page, SHORT_WAIT_TIME);
  
  // Initialize an object to store shared data
  const sharedData: any = {};
  if(dt_outPatientRegistrationNew.isAppoitnment){
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
      dataTables[1].name, 
      dataTables[1].pickIndex,
      'https://sitmcare21.columbiaasia.com/api/appointmentapi/AppointmentAPI/AddAppointmentSchedule'
    );
    console.log('IC No:', icNo);
    console.log('Appointment ID:', appointmentId);
    console.log('Patient Name:', patientName);
    console.log('Birth Date:', birthDate);
    console.log('Mobile Number:', mobileNumber);
    // Store data in shared object
    sharedData.patientName = patientName;
    sharedData.appointmentId = appointmentId;
    sharedData.icNo = icNo;
    sharedData.age = age;
    sharedData.mobileNumber = mobileNumber;
  }
    // Handle input name
    await LIB_PatientRegistration.bc_HandleInputName(page,dt_outPatientRegistrationNew.isAppoitnment, dataTables[1].name, dataTables[1].pickIndex, SHORT_WAIT_TIME);
  
    // Handle fill patient info
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
      dataTables[1].name, 
      dataTables[1].pickIndex,
      SHORT_WAIT_TIME
    );
    
  
    // Handle additional patient details
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
      dataTables[1].name, 
      dataTables[1].pickIndex,
      SHORT_WAIT_TIME
    );
  
    // Handle visit admission details
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
      dataTables[1].name, 
      dataTables[1].pickIndex,
      SHORT_WAIT_TIME
    );
  
    
  
    // Handle emergency contact details
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
      dataTables[1].name, 
      dataTables[1].pickIndex,
      SHORT_WAIT_TIME
    );
  
    // Handle medico-legal case if applicable
    const caretypesList = dt_outPatientRegistrationNew.careTypes.split('|');
    if (caretypesList.includes('mlc')) {
      console.log('MLC is present. Performing the action.');
      await LIB_PatientRegistration.bc_HandleMedicoLeagalCase(
        page, 
        dt_outPatientRegistrationNew.mlcNo, 
        dt_outPatientRegistrationNew.mlcType,
        dt_outPatientRegistrationNew.modeofArival,
        dt_outPatientRegistrationNew.mlcMrn,
        dt_outPatientRegistrationNew.mlcCountryCode,
        dt_outPatientRegistrationNew.mlcRemark,
        dataTables[1].name, 
        dataTables[1].pickIndex
      );
    } else {
      console.log('MLC is not present.');
    }
  
      // Handle guardian details if applicable
    const isGuardianEnable = await BaseCommandCaller.isLocatorPresent(
      page,
      'PG_PatientRegistration.card_collapseguardian',
      dt_outPatientRegistrationNew.wait,
      'soft'
    );
    
    if (isGuardianEnable) {
      // Expand guardian details section
      await LIB_PatientRegistration.bc_HandleGuardianDetailsExpandSection(page);
    
      // Fill guardian details
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
        dataTables[1].name, 
        dataTables[1].pickIndex,
        dt_outPatientRegistrationNew.wait
      );
    }
    
    // Finalize registration
    await LIB_PatientRegistration.bc_HandleClickonRegisterButton(page, dt_outPatientRegistrationNew.isNewBorn);
    await LIB_PatientRegistration.bc_HandleStoreMrnandVisitNo(page, dataTables[1].name, dataTables[1].pickIndex);
    await LIB_PatientRegistration.bc_VerifyRegistrationDetailsinPatientInfo(page, dataTables[1].name, dataTables[1].pickIndex);
    await LIB_PatientRegistration.bc_VerifyRegistrationDetailsinAdditionalPatientDetails(
      page,
      dt_outPatientRegistrationNew.needPatientRemark,
      dt_outPatientRegistrationNew.addPatientRemark,
      dataTables[1].name, 
      dataTables[1].pickIndex
    );
    await LIB_PatientRegistration.bc_VerifyRegistrationDetailsinVisitAdmission(
      page,
      dt_outPatientRegistrationNew.isPrivilege,
      dt_outPatientRegistrationNew.privilageType,
      dt_outPatientRegistrationNew.privilageRemark,
      dataTables[1].name, 
      dataTables[1].pickIndex
    );
    await LIB_PatientRegistration.bc_VerifyRegistrationDetailsinEmergencyContact(
      page,
      dt_outPatientRegistrationNew.isSamePatientAddress,
      dataTables[1].name, 
      dataTables[1].pickIndex
    );
  
}

export async function handleRegisterInpatiens(page: Page,dt_requestForAdmission: any, dt_inPatientRegistration: any, dataTables: DataTableConfig[]) {
    await LIB_Common.bc_HandelClickOnMenu(page, dt_inPatientRegistration.mainnavgationname, SHORT_WAIT_TIME);
    await LIB_Common.bc_HandelSubNavigationLinkClick(page, dt_inPatientRegistration.subnavgationname, SHORT_WAIT_TIME);
    const isGuardianEnable = await BaseCommandCaller.isLocatorPresent(
      page,
      'PG_PatientRegistration.card_collapseguardian',
      SHORT_WAIT_TIME,
      'soft'
    );    
    if (isGuardianEnable) {
      // Expand guardian details section
      await LIB_PatientRegistration.bc_HandleGuardianDetailsExpandSection(page);
    }
    await LIB_PatientRegistration.bc_HandleClickOnRequestForAdmissionButton(page, SHORT_WAIT_TIME);
    const rfaData = DataHelper.reloadData(dataTables[0].name);
    await LIB_PatientRegistration.bc_HandleSearchRFAinPatientRegistration(page, dt_inPatientRegistration.fromDate,dt_inPatientRegistration.toDate,rfaData[dataTables[0].pickIndex].rfaId,SHORT_WAIT_TIME);
    await LIB_PatientRegistration.bc_HandleAdmissionExpandSection(page, SHORT_WAIT_TIME);
    
    await LIB_PatientRegistration.bc_HandleAdmission(page,dt_requestForAdmission.ward,dt_requestForAdmission.bedType,SHORT_WAIT_TIME);
    await LIB_PatientRegistration.bc_HandleClickOnNavEdit(page,SHORT_WAIT_TIME);
    await LIB_PatientRegistration.bc_VerifyChargeTypeisInPatient(page,SHORT_WAIT_TIME);
}

export async function handleExistingOutPatientRegistration(page: Page,dt_outPatientRegistrationExisting: any, dataTables: DataTableConfig[]) {
// Patient registration steps
  if(!dt_outPatientRegistrationExisting.isDirect){
    await LIB_PatientRegistration.bc_VerifyPageNavigation(
      page,
      dt_outPatientRegistrationExisting.registrationheader,
      dt_outPatientRegistrationExisting.registration_url,
      8000
    );
  }
  await LIB_PatientRegistration.bc_HandleOutPatientRegistrationType(page, dt_outPatientRegistrationExisting.careTypes, 3000);
  if(!dt_outPatientRegistrationExisting.isDirect){
    await LIB_PatientRegistration.bc_VerifyRegistrationPatientField(page, SHORT_WAIT_TIME);
    await LIB_PatientRegistration.bc_HandleMrnSearchWithoutVisitNumber(page,dt_outPatientRegistrationExisting.mrnInputManually,dt_outPatientRegistrationExisting.patientMrn,'MyKAD');
    await LIB_PatientRegistration.bc_HandleStoreExistingPatientInfo(page,dataTables[1].name,dataTables[1].pickIndex);  
  }
  await LIB_PatientRegistration.bc_HandleAdditionalPatientDetailsExpandSection(page);
  await LIB_PatientRegistration.bc_HandleStoreExistingAdditionalPatientDetails(page,dataTables[1].name,dataTables[1].pickIndex);
  await LIB_PatientRegistration.bc_HandleVisitAdmissionDetailsExpandSection(page);
  await LIB_PatientRegistration.bc_HandleStoreExistingVisitAdmissionDetails(page,dataTables[1].name,dataTables[1].pickIndex);
  await LIB_PatientRegistration.bc_HandleEmergencyContactDetailsExpandSection(page);
  await LIB_PatientRegistration.bc_HandleStoreExistingEmergencyContactDetails(page,dataTables[1].name,dataTables[1].pickIndex);
  await LIB_PatientRegistration.bc_HandleExistingPatientPatientInfoMandetoryFields(page,
    dt_outPatientRegistrationExisting.expectedIdentificationType,
    dt_outPatientRegistrationExisting.gender,
    dt_outPatientRegistrationExisting.nicType,
    dt_outPatientRegistrationExisting.expectedCountryofIssueexpected, 
    dt_outPatientRegistrationExisting.expectedNationality,
    dt_outPatientRegistrationExisting.expectedRace,
    dt_outPatientRegistrationExisting.expectedEmail,
    dataTables[1].name, 
    dataTables[1].pickIndex
  );
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
    dataTables[1].name, 
    dataTables[1].pickIndex,
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
    dataTables[1].name, 
    dataTables[1].pickIndex,
  );
  const isGuardianEnable = await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.card_collapseguardian',dt_outPatientRegistrationExisting.wait,'soft');
  if(isGuardianEnable){
    const updatedData = DataHelper.reloadData(dataTables[1].name);
    await LIB_PatientRegistration.bc_HandleGuardianDetailsExpandSection(page);
    await LIB_PatientRegistration.bc_HandleGuardianDetails(
      page,
      dt_outPatientRegistrationExisting.isGuardianMrn,
      dt_outPatientRegistrationExisting.guardianMrn,
      dt_outPatientRegistrationExisting.isSameAsEmergencyDetails,
      updatedData[dataTables[1].pickIndex].street1Relation,
      updatedData[dataTables[1].pickIndex].street2Relation,
      updatedData[dataTables[1].pickIndex].street3Relation,
      updatedData[dataTables[1].pickIndex].street4Relation,
      updatedData[dataTables[1].pickIndex].countryRelation,
      updatedData[dataTables[1].pickIndex].stateRelation,
      updatedData[dataTables[1].pickIndex].townRelation,
      updatedData[dataTables[1].pickIndex].postcodeRelation,
      updatedData[dataTables[1].pickIndex].relationCountryCode,
      updatedData[dataTables[1].pickIndex].relationMobileNumber,
      updatedData[dataTables[1].pickIndex].relationRetrievCountryCode,
      dt_outPatientRegistrationExisting.guardianStreet1,
      dt_outPatientRegistrationExisting.guardianCountry,
      dt_outPatientRegistrationExisting.guardianState,
      dt_outPatientRegistrationExisting.guardianCity,
      dataTables[1].name, 
      dataTables[1].pickIndex,
      dt_outPatientRegistrationExisting.wait);
  }

  await LIB_PatientRegistration.bc_HandleClickonRegisterButton(page, dt_outPatientRegistrationExisting.isNewBorn);
  await LIB_PatientRegistration.bc_HandleStoreMrnandVisitNo(page, dataTables[1].name, dataTables[1].pickIndex);
  await LIB_PatientRegistration.bc_VerifyExistingPatientRegistrationDetailsinVisitAdmission(page, 
    dt_outPatientRegistrationExisting.isPrivilege, 
    dt_outPatientRegistrationExisting.expectedPrivilegeType, 
    dt_outPatientRegistrationExisting.expectedPrivilageRemark, 
    dataTables[1].name, 
    dataTables[1].pickIndex
  );
  await LIB_PatientRegistration.bc_VerifyExistingPatientRegistrationDetailsinEmergencyContact(page,dataTables[1].name, dataTables[1].pickIndex);
}

export async function handleExistingPatientMRNExtract(page: Page,dt_outPatientRegistrationExisting: any,dataTables: DataTableConfig[]) {

  await LIB_PatientRegistration.bc_VerifyRegistrationPatientField(page, SHORT_WAIT_TIME);
  await LIB_PatientRegistration.bc_HandleMrnSearchWithoutVisitNumber(page,dt_outPatientRegistrationExisting.mrnInputManually,dt_outPatientRegistrationExisting.patientMrn,'MyKAD');
  await LIB_PatientRegistration.bc_HandleStoreExistingPatientInfo(page,dataTables[1].name,dataTables[1].pickIndex);  
  
}