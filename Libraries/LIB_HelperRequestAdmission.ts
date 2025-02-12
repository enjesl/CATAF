import { test,Page } from '@playwright/test';
import { LIB_Common } from './LIB_Common';
import { DataHelper } from '../Runtime/Helpers/DataHelper';
import { BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';
import { LIB_RequestForAdmission } from './LIB_RequestForAdmission';
import { LIB_BedEnquiry } from './LIB_BedEnquiry';

const WAIT_TIME = 8000;
const SHORT_WAIT_TIME = 3000;

// Define the TestCase interface
interface DataTableConfig {
    name: string;
    pickIndex: number;
}

/**
 * Handles the first part of the request for admission process.
 * 
 * @param {Page} page - The Playwright page object.
 * @param {any} dt_requestForAdmission - Data table containing patient admission details for part one.
 * @param {any} dt_outPatientRegistrationNew - Data table containing new outpatient registration details.
 * @param {DataTableConfig[]} dataTables - Array of data table configurations.
 * 
 * @throws Will throw an error if the RFA ID is null.
 * 
 * @remarks
 * This function navigates to the Request for Admission section, handles patient and doctor information, saves the request, 
 * verifies the information, and if applicable, handles the second part of the admission process including patient room and 
 * board information, patient admission acknowledgement, guarantor information, and various acknowledgements.
 * 
 * @example
 * ```typescript
 * await handleRequestForAdmsionPartOne(page, dt_requestForAdmission, dt_outPatientRegistrationNew, dataTables);
 * ```
 */
export async function handleRequestForAdmsionNewPartOne(page: Page, dt_requestForAdmission: any, dt_outPatientRegistrationNew: any, dataTables: DataTableConfig[]) {

  
    // Navigate to the Request for Admission section
    await LIB_Common.bc_HandelClickOnMenu(page, dt_requestForAdmission.mainnavgationname, SHORT_WAIT_TIME);
    await LIB_Common.bc_HandelSubNavigationLinkClick(page, dt_requestForAdmission.subnavgationname, SHORT_WAIT_TIME);
  
    // Handle patient information
    await LIB_RequestForAdmission.bc_HandelRFAPatientInfo(
      page,
      dt_outPatientRegistrationNew.patientNic,
      dt_outPatientRegistrationNew.passportNumber,
      dt_outPatientRegistrationNew.isDirect,
      dt_outPatientRegistrationNew.isNewBorn,
      dataTables[1].name,
      dataTables[1].pickIndex,
      SHORT_WAIT_TIME
    );
  
    const updatedData = DataHelper.reloadData(dataTables[1].name);
  
    // Handle doctor section
    await LIB_RequestForAdmission.bc_HandlePartOneDoctorSectionExpand(page);
    await LIB_RequestForAdmission.bc_PartOneDoctor(
      page,
      dt_requestForAdmission.isElectiveAdmission,
      dt_requestForAdmission.isDayCare,
      dt_requestForAdmission.isNewBorn,
      dt_requestForAdmission.dateType,
      dt_requestForAdmission.howManyDaysFutureOrPast,
      dt_requestForAdmission.estimatedLegnthofStay,
      dt_requestForAdmission.estimatedCost,
      dt_requestForAdmission.otherRemark,
      dt_requestForAdmission.isCashPayment,
      dt_requestForAdmission.isCorporate,
      updatedData[dataTables[1].pickIndex].doctor,
      dt_requestForAdmission.uploadFilePath,
      dataTables[0].name,
      dataTables[0].pickIndex,
      SHORT_WAIT_TIME
    );
  
    // Save and store RFA ID
    await LIB_RequestForAdmission.bc_HandelClickOnSaveButton(page, SHORT_WAIT_TIME);
    const rfaId = await LIB_RequestForAdmission.bc_StoreRFAId(page, dataTables[0].name, dataTables[0].pickIndex, SHORT_WAIT_TIME);
    if (rfaId === null) {
      console.error("RFA ID is null. Cannot proceed with search.");
      
      // Mark the test as failed in the report
      test.fail(true, `Locator not found: ${rfaId}`);
    
      // Optionally throw an error if you want to halt further execution
      throw new Error("RFA ID is null. Test case marked as failed.");
    }
    
    // Clear and search for the RFA ID
    await BaseCommandCaller.hardPause(page, SHORT_WAIT_TIME);
    await LIB_RequestForAdmission.bc_HandelClickOnClearButton(page, SHORT_WAIT_TIME);
    await LIB_RequestForAdmission.bc_HandelClickOnClearPopUpOkButton(page, SHORT_WAIT_TIME);
    await LIB_RequestForAdmission.bc_SearchRFAId(
      page,
      dt_requestForAdmission.fromDate,
      dt_requestForAdmission.toDate,
      dt_requestForAdmission.admissionState,
      rfaId,
      SHORT_WAIT_TIME
    );
  
    const dataAfterPartOne = DataHelper.reloadData(dataTables[0].name);
  
    // Verify patient information
    await LIB_RequestForAdmission.bc_VerifyRFAPatientInfo(
      page,
      updatedData[dataTables[1].pickIndex].isNewBorn,
      updatedData[dataTables[1].pickIndex].mrnNo,
      updatedData[dataTables[1].pickIndex].patientName,
      updatedData[dataTables[1].pickIndex].patientNic,
      updatedData[dataTables[1].pickIndex].passportNumber,
      updatedData[dataTables[1].pickIndex].patientGurdianNic,
      updatedData[dataTables[1].pickIndex].genders,
      updatedData[dataTables[1].pickIndex].patientMrn,
      updatedData[dataTables[1].pickIndex].age,
      dataAfterPartOne[dataTables[0].pickIndex].rfaId,
      updatedData[dataTables[1].pickIndex].isDirect,
      SHORT_WAIT_TIME
    );

    //----------------------------------------------------------------------------------------------------
    // Cancel RFA If Needs Start
    if(dt_requestForAdmission.isCancel){
      await LIB_Common.bc_HandelClickOnNavigationCancelButton(page,SHORT_WAIT_TIME);
      await LIB_RequestForAdmission.bc_CancelRFA(page,dt_requestForAdmission.cancelationReason, SHORT_WAIT_TIME);
      await LIB_RequestForAdmission.bc_HandelClickOnClearButton(page, SHORT_WAIT_TIME);
      await LIB_RequestForAdmission.bc_HandelClickOnClearPopUpOkButton(page, SHORT_WAIT_TIME);
      await LIB_RequestForAdmission.bc_SearchRFAId(
        page,
        dt_requestForAdmission.fromDate,
        dt_requestForAdmission.toDate,
        'Cancel',
        rfaId,
        SHORT_WAIT_TIME
      );
    }
    // Cancel RFA If Needs End
    //----------------------------------------------------------------------------------------------------
    // Verify doctor information
    await LIB_RequestForAdmission.bc_VerifyPartOneDoctor(
      page,
      dt_requestForAdmission.isElectiveAdmission,
      dt_requestForAdmission.isDayCare,
      dt_requestForAdmission.isNewBorn,
      dataAfterPartOne[dataTables[0].pickIndex].scheduleAdmissionDate,
      dt_requestForAdmission.estimatedLegnthofStay,
      dt_requestForAdmission.estimatedCost,
      dt_requestForAdmission.isCashPayment,
      dt_requestForAdmission.isCorporate,
      updatedData[dataTables[1].pickIndex].doctor,
      SHORT_WAIT_TIME
    );

    //----------------------------------------------------------------------------------------------------
    // Edit Part One RFA Start
    await LIB_RequestForAdmission.bc_VerifyPartOneFieldsDisabled(page, SHORT_WAIT_TIME);
    if(dt_requestForAdmission.isPartOneEdit){
      await LIB_Common.bc_HandelClickOnNavEditButton(page, SHORT_WAIT_TIME);
      await LIB_RequestForAdmission.bc_HandelClickOnEditButton(page, SHORT_WAIT_TIME);
      await LIB_RequestForAdmission.bc_EditPartOneDeposittoBeCollected(page,dt_requestForAdmission.editDepositToBeCollect,SHORT_WAIT_TIME);
      await LIB_Common.bc_HandelClickOnNavSaveButton(page,SHORT_WAIT_TIME);
      await LIB_RequestForAdmission.bc_VerifyEditPartOneDeposittoBeCollected(page,dt_requestForAdmission.editDepositToBeCollect, SHORT_WAIT_TIME)
    }
    // Edit Part One RFA End
    //----------------------------------------------------------------------------------------------------
    
}

export async function handleRequestForAdmsionPartTwo(page: Page, dt_requestForAdmission: any, dataTables: DataTableConfig[]) {
  const isPartTwo = dt_requestForAdmission.isPartTwo;
  const dataAfterPartOne = DataHelper.reloadData(dataTables[0].name);
  // Handle Part Two if applicable
    if (isPartTwo === true) {
      await BaseCommandCaller.hardPause(page,SHORT_WAIT_TIME,false,'Stablize the page');
      await LIB_RequestForAdmission.bc_HandlePartTwoPatientSectionExpand(page);
      await LIB_RequestForAdmission.bc_PartTwoPatientRoomandBoardInformation(
        page,
        dt_requestForAdmission.ward,
        dataAfterPartOne[dataTables[0].pickIndex].bedType,
        SHORT_WAIT_TIME
      );
      await LIB_RequestForAdmission.bc_PartTwoPatientAdmissionAcknowledgement(
        page,
        dt_requestForAdmission.isCashPaymentPartOne,
        dt_requestForAdmission.isCorporatePartTwo,
        dt_requestForAdmission.debetorCode,
        dt_requestForAdmission.insuranceTerm,
        dt_requestForAdmission.insurancePercentage,
        dt_requestForAdmission.insuranceAmount,
        dt_requestForAdmission.depositAmount,
        dt_requestForAdmission.roomBoardLimit,
        dt_requestForAdmission.roomEntitlement,
        dt_requestForAdmission.specialRequest,
        dt_requestForAdmission.remark,
        SHORT_WAIT_TIME
      );
      const updatedData = DataHelper.reloadData(dataTables[1].name);
      await LIB_RequestForAdmission.bc_PartTwoPatientGuarantorInformation(
        page,
        dt_requestForAdmission.isSameAsPatientInfo,
        updatedData[dataTables[1].pickIndex].patientName,
        dt_requestForAdmission.relationType,
        updatedData[dataTables[1].pickIndex].passportNumber,
        updatedData[dataTables[1].pickIndex].patientNic,
        updatedData[dataTables[1].pickIndex].countryCode,
        updatedData[dataTables[1].pickIndex].patientMobileNo,
        updatedData[dataTables[1].pickIndex].street1,
        updatedData[dataTables[1].pickIndex].street2,
        updatedData[dataTables[1].pickIndex].street3,
        updatedData[dataTables[1].pickIndex].street4,
        updatedData[dataTables[1].pickIndex].countryAditionalInfo,
        updatedData[dataTables[1].pickIndex].state,
        updatedData[dataTables[1].pickIndex].town,
        updatedData[dataTables[1].pickIndex].postalCode,
        dt_requestForAdmission.isSameAsEmergency,
        updatedData[dataTables[1].pickIndex].contactPersonName,
        updatedData[dataTables[1].pickIndex].relationType,
        updatedData[dataTables[1].pickIndex].relationCountryCode,
        updatedData[dataTables[1].pickIndex].relationMobileNumber,
        updatedData[dataTables[1].pickIndex].street1Relation,
        updatedData[dataTables[1].pickIndex].street2Relation,
        updatedData[dataTables[1].pickIndex].street3Relation,
        updatedData[dataTables[1].pickIndex].street4Relation,
        updatedData[dataTables[1].pickIndex].countryRelation,
        updatedData[dataTables[1].pickIndex].stateRelation,
        updatedData[dataTables[1].pickIndex].townRelation,
        updatedData[dataTables[1].pickIndex].postcodeRelation,
        dt_requestForAdmission.nicType,
        dt_requestForAdmission.guarantorRelationType,
        dt_requestForAdmission.guarantorCountryCode,
        dt_requestForAdmission.guarantorStreet1,
        dt_requestForAdmission.guarantorStreet2,
        dt_requestForAdmission.guarantorStreet3,
        dt_requestForAdmission.guarantorStreet4,
        dt_requestForAdmission.guarantorCountry,
        dt_requestForAdmission.guarantorState,
        dt_requestForAdmission.guarantorTown,
        dt_requestForAdmission.guarantorPostcode,
        dataTables[0].name,
        dataTables[0].pickIndex,
        SHORT_WAIT_TIME
      );
  
      // Acknowledgements
      await LIB_RequestForAdmission.bc_HospitalStaffAcknowledgement(
        page,
        dt_requestForAdmission.nicType,
        dataTables[0].name,
        dataTables[0].pickIndex,
        SHORT_WAIT_TIME
      );
      await LIB_RequestForAdmission.bc_PatientAcknowledgement(
        page,
        dataTables[0].name,
        dataTables[0].pickIndex,
        SHORT_WAIT_TIME
      );
      await LIB_RequestForAdmission.bc_GuarantorAcknowledgement(
        page,
        dataTables[0].name,
        dataTables[0].pickIndex,
        SHORT_WAIT_TIME
      );
  
      // Save and finalize
      await LIB_RequestForAdmission.bc_ClickOnDraftButton(page, SHORT_WAIT_TIME);
      await BaseCommandCaller.hardPause(page, SHORT_WAIT_TIME);
      await LIB_RequestForAdmission.bc_HandelClickOnSaveButton(page, SHORT_WAIT_TIME);
      await BaseCommandCaller.hardPause(page, 30000);
    }

}


export async function handleRequestForAdmsionExistingPartOne(page: Page, dt_requestForAdmission: any, dt_outPatientRegistrationExisting: any, dataTables: DataTableConfig[]) {
  const isPartTwo = dt_requestForAdmission.isPartTwo;

  // Navigate to the Request for Admission section
  await LIB_Common.bc_HandelClickOnMenu(page, dt_requestForAdmission.mainnavgationname, SHORT_WAIT_TIME);
  await LIB_Common.bc_HandelSubNavigationLinkClick(page, dt_requestForAdmission.subnavgationname, SHORT_WAIT_TIME);

  // Handle patient information
  await LIB_RequestForAdmission.bc_HandelRFAPatientInfo(
    page,
    dt_outPatientRegistrationExisting.patientNic,
    dt_outPatientRegistrationExisting.passportNumber,
    dt_outPatientRegistrationExisting.isDirect,
    dt_outPatientRegistrationExisting.isNewBorn,
    dataTables[1].name,
    dataTables[1].pickIndex,
    SHORT_WAIT_TIME
  );

  const updatedData = DataHelper.reloadData(dataTables[1].name);

  // Handle doctor section
  await LIB_RequestForAdmission.bc_HandlePartOneDoctorSectionExpand(page);
  await LIB_RequestForAdmission.bc_PartOneDoctor(
    page,
    dt_requestForAdmission.isElectiveAdmission,
    dt_requestForAdmission.isDayCare,
    dt_requestForAdmission.isNewBorn,
    dt_requestForAdmission.dateType,
    dt_requestForAdmission.howManyDaysFutureOrPast,
    dt_requestForAdmission.estimatedLegnthofStay,
    dt_requestForAdmission.estimatedCost,
    dt_requestForAdmission.otherRemark,
    dt_requestForAdmission.isCashPayment,
    dt_requestForAdmission.isCorporate,
    updatedData[dataTables[1].pickIndex].doctor,
    dt_requestForAdmission.uploadFilePath,
    dataTables[0].name,
    dataTables[0].pickIndex,
    SHORT_WAIT_TIME
  );

  // Save and store RFA ID
  await LIB_RequestForAdmission.bc_HandelClickOnSaveButton(page, SHORT_WAIT_TIME);
  const rfaId = await LIB_RequestForAdmission.bc_StoreRFAId(page, dataTables[0].name, dataTables[0].pickIndex, SHORT_WAIT_TIME);
  if (rfaId === null) {
    console.error("RFA ID is null. Cannot proceed with search.");
    
    // Mark the test as failed in the report
    test.fail(true, `Locator not found: ${rfaId}`);
  
    // Optionally throw an error if you want to halt further execution
    throw new Error("RFA ID is null. Test case marked as failed.");
  }
  
  // Clear and search for the RFA ID
  await BaseCommandCaller.hardPause(page, SHORT_WAIT_TIME);
  await LIB_RequestForAdmission.bc_HandelClickOnClearButton(page, SHORT_WAIT_TIME);
  await LIB_RequestForAdmission.bc_HandelClickOnClearPopUpOkButton(page, SHORT_WAIT_TIME);
  await LIB_RequestForAdmission.bc_SearchRFAId(
    page,
    dt_requestForAdmission.fromDate,
    dt_requestForAdmission.toDate,
    dt_requestForAdmission.admissionState,
    rfaId,
    SHORT_WAIT_TIME
  );

  const dataAfterPartOne = DataHelper.reloadData(dataTables[0].name);

  // Verify patient information
  await LIB_RequestForAdmission.bc_VerifyRFAPatientInfo(
    page,
    updatedData[dataTables[1].pickIndex].isNewBorn,
    updatedData[dataTables[1].pickIndex].mrnNo,
    updatedData[dataTables[1].pickIndex].patientName,
    updatedData[dataTables[1].pickIndex].patientNic,
    updatedData[dataTables[1].pickIndex].passportNumber,
    updatedData[dataTables[1].pickIndex].patientGurdianNic,
    updatedData[dataTables[1].pickIndex].genders,
    updatedData[dataTables[1].pickIndex].patientMrn,
    updatedData[dataTables[1].pickIndex].age,
    dataAfterPartOne[dataTables[0].pickIndex].rfaId,
    updatedData[dataTables[1].pickIndex].isDirect,
    SHORT_WAIT_TIME
  );
  //----------------------------------------------------------------------------------------------------
  // Cancel RFA If Needs Start
  if(dt_requestForAdmission.isCancel){
    await LIB_Common.bc_HandelClickOnNavigationCancelButton(page,SHORT_WAIT_TIME);
    await LIB_RequestForAdmission.bc_CancelRFA(page,dt_requestForAdmission.cancelationReason, SHORT_WAIT_TIME);
    await LIB_RequestForAdmission.bc_HandelClickOnClearButton(page, SHORT_WAIT_TIME);
    await LIB_RequestForAdmission.bc_HandelClickOnClearPopUpOkButton(page, SHORT_WAIT_TIME);
    await LIB_RequestForAdmission.bc_SearchRFAId(
      page,
      dt_requestForAdmission.fromDate,
      dt_requestForAdmission.toDate,
      'Cancel',
      rfaId,
      SHORT_WAIT_TIME
    );
  }
  // Cancel RFA If Needs End
  //----------------------------------------------------------------------------------------------------
  // Verify doctor information
  await LIB_RequestForAdmission.bc_VerifyPartOneDoctor(
    page,
    dt_requestForAdmission.isElectiveAdmission,
    dt_requestForAdmission.isDayCare,
    dt_requestForAdmission.isNewBorn,
    dataAfterPartOne[dataTables[0].pickIndex].scheduleAdmissionDate,
    dt_requestForAdmission.estimatedLegnthofStay,
    dt_requestForAdmission.estimatedCost,
    dt_requestForAdmission.isCashPayment,
    dt_requestForAdmission.isCorporate,
    updatedData[dataTables[1].pickIndex].doctor,
    SHORT_WAIT_TIME
  );
}

export async function BedEnquiryandGetVacanBed(page: Page, dt_requestForAdmission: any, dataTables: DataTableConfig[]) {

    // Navigate to the Request for Admission section
    await LIB_Common.bc_HandelClickOnMenu(page, dt_requestForAdmission.mainnavgationname, SHORT_WAIT_TIME);
    await LIB_Common.bc_HandelSubNavigationLinkClick(page, dt_requestForAdmission.subnavgationBedEnquiery, SHORT_WAIT_TIME);
    await LIB_BedEnquiry.bc_GetVacantBeds(
      page,
      dt_requestForAdmission.ward,
      dataTables[0].name,
      dataTables[0].pickIndex,
      SHORT_WAIT_TIME
    );
}

