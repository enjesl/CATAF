// LIB_RequestForAdmission.ts

import { Page } from '@playwright/test';
import { BaseCommandCaller as BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';  // Import Playwright wrapper methods
import { generateDate } from '../Runtime/Utilities/DateGenerator';
import { getLocatorWithDynamicValue, resolveLocator} from '../Runtime/Helpers/LocatorHelper'; 
import { NICGenerator } from '../Runtime/Utilities/NICGenerator';
import { DataHelper} from '../Runtime/Helpers/DataHelper'; 
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { NameGenerator } from '../Runtime/Utilities/NameGenerator';
import { MobileNumberGenerator } from '../Runtime/Utilities/MobileNumberGenerator';
import { openAsBlob } from 'fs';


export class LIB_RequestForAdmission {
      
  /**
   * Fills and verifies patient information on the Request For Admission page.
   *
   * @param {Page} page - The Playwright Page object representing the browser page.
   * @param {string} patientNicNo - The patient's National Identification Card number.
   * @param {string} passportNo - The patient's passport number.
   * @param {string} patientGender - The patient's gender.
   * @param {string} datatableName - The name of the data table containing patient information.
   * @param {number} index - The index of the patient data in the data table.
   * @param {number} wait - The wait time for locator presence and invisibility checks.
   * @returns {Promise<void>} - A promise that resolves when the patient information has been filled and verified.
   */
  static async bc_HandelRFAPatientInfo(page: Page,patientNicNo: string,passportNo: string,
    isDirect:boolean,isNewBorn:boolean,datatableName: string, index: number, wait: number) {
    const updatedData = DataHelper.reloadData(datatableName);
    const updadtedMrn = updatedData[index].mrnNo;
    const updadtedPatientMrn = updatedData[index].patientMrn;
    const updadtedNicNo = updatedData[index].patientNic;
    const updadtedPassport = updatedData[index].passportNumber;
    const updadtedPatientDOB = updatedData[index].DOB
    const updadtedPatientdob = updatedData[index].dob
    const updadtedPatientage = updatedData[index].age
    const updadtedPatientName = updatedData[index].patientName
    const updadtedpatientGender = updatedData[index].genders
    const updadtedpatientGurdianNic = updatedData[index].patientGurdianNic
    

    console.log('updadtedNicNo',updadtedNicNo);
    console.log('*********************patientNicNo',patientNicNo);
    console.log('****************updadtedMrn',updadtedMrn);
    console.log('****************updadtedMrn',updadtedPatientName);
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_mrn',wait, 'soft' );
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_mrn');
    if(isDirect){
      await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_mrn', updadtedPatientMrn)
    }
    if(!isDirect){
      await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_mrn', updadtedMrn)
    }
    await BaseCommandCaller.tab(page,'PG_RequestForAdmission.input_mrn');
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.button_disabledsave',wait, 'soft' );
    await BaseCommandCaller.waitUntilLocatorInvisible(page,'PG_RequestForAdmission.button_disabledsave',wait);
    if(isDirect){
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_mrn',updadtedPatientMrn);
    }
    if(!isDirect){
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_mrn',updadtedMrn);
    }
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_patientname',updadtedPatientName);
    if(isNewBorn === true){

      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_oldicorpassport',updadtedpatientGurdianNic);

    }else{
      if(patientNicNo === 'null' || patientNicNo === null || patientNicNo === '' || patientNicNo === 'undefined' || patientNicNo === updadtedNicNo)
      { 
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_oldicorpassport',updadtedPassport);
      }

      if(passportNo === 'null' || passportNo === null || passportNo === '' || passportNo === 'undefined' || passportNo === updadtedPassport)
      { 
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_nicno',updadtedNicNo);
      }
    }

    console.log("Me balapiyaaaaaaaaaaaaaa", updadtedPatientDOB)
    console.log("Me balapiyaaaaaaaaaaaaaa", updadtedPatientage)
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_gender',updadtedpatientGender);
    if(updadtedPatientDOB === null || updadtedPatientDOB === undefined){
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_dob',updadtedPatientdob);
    }
    if(updadtedPatientDOB){
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_dob',updadtedPatientDOB);
    }
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_age',updadtedPatientage);
    
  }

    /**
   * Handles the expansion of the Part One Doctor section in the Request for Admission page.
   * 
   * This function checks if the Part One Doctor section is already expanded. If it is not,
   * it will click on the section to expand it.
   * 
   * @param page - The Playwright Page object representing the browser page.
   * @param wait - The time in milliseconds to wait for the locator to be present. Default is 5000ms.
   * 
   * @returns A promise that resolves when the section is expanded.
   */
  static async bc_HandlePartOneDoctorSectionExpand(page: Page, wait: number = 5000) {
    const isSectionExpand = await BaseCommandCaller.isLocatorPresent(page,'PG_RequestForAdmission.card_part1doctor',wait,'hard');
   if(isSectionExpand){
    await BaseCommandCaller.click(page,'PG_RequestForAdmission.card_part1doctor');
   }
  }

  /**
   * Handles the expansion of the Part Two Patient section in the Request for Admission page.
   * 
   * This function checks if the Part Two Patient section is present and expanded. If it is,
   * it clicks on the section to expand it.
   * 
   * @param page - The Playwright Page object representing the browser page.
   * @param wait - The time in milliseconds to wait for the locator to be present. Default is 5000 ms.
   * @returns A promise that resolves when the section has been expanded.
   */
  static async bc_HandlePartTwoPatientSectionExpand(page: Page, wait: number = 5000) {
    const isSectionExpand = await BaseCommandCaller.isLocatorPresent(page,'PG_RequestForAdmission.card_part2patient',wait,'hard');
   if(isSectionExpand){
    await BaseCommandCaller.click(page,'PG_RequestForAdmission.card_part2patient');
   }
  }

  /**
   * Handles the first part of the doctor admission process.
   * 
   * @param page - The Playwright Page object.
   * @param iselectiveAdmission - Indicates if the admission is elective.
   * @param isDayCare - Indicates if the admission is for day care.
   * @param isNewBorn - Indicates if the patient is a newborn.
   * @param dateType - The type of date to generate (e.g., 'future' or 'past').
   * @param howManyDaysFutureOrPast - The number of days in the future or past to generate the date.
   * @param estimatedLegnthofStay - The estimated length of stay.
   * @param estimatedCost - The estimated cost of the admission.
   * @param otherRemark - Additional remarks for 'Other Case' cost.
   * @param isCashPayment - Indicates if the payment is cash.
   * @param isCorporate - Indicates if the patient is corporate.
   * @param doctorName - The name of the admitting doctor.
   * @param uploadFilePath - The file path to upload.
   * @param datatableName - The name of the data table to store input data.
   * @param index - The index for storing data in the data table.
   * @param wait - The wait time for locator presence checks.
   * 
   * @returns A promise that resolves when the process is complete.
   * 
   * @remarks
   * This function performs the following steps:
   * - Selects the type of admission (elective or non-elective).
   * - Checks and sets the day care and newborn options.
   * - Generates and fills the scheduled admission date.
   * - Fills the estimated length of stay and cost.
   * - Handles 'Other Case' cost remarks.
   * - Sets the payment type (cash or corporate).
   * - Selects the admitting doctor.
   * - Uploads a file.
   * 
   * @async
   */
  static async bc_PartOneDoctor(page: Page,iselectiveAdmission: boolean,isDayCare: boolean,isNewBorn: boolean, dateType: string, 
    howManyDaysFutureOrPast: number,estimatedLegnthofStay: string,estimatedCost: string,otherRemark: string,isCashPayment:boolean,
    isCorporate: boolean,doctorName: string,uploadFilePath: string, datatableName: string, index: number, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_electiveadmission',wait, 'soft' );
    if(iselectiveAdmission === true){
        await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_electiveadmission',wait, 'soft' );
        await BaseCommandCaller.click(page,'PG_RequestForAdmission.radio_electiveadmission');
    }
    else{
        await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_nonelectiveadmission',wait, 'soft' );
        await BaseCommandCaller.click(page,'PG_RequestForAdmission.radio_nonelectiveadmission');
    }
    if(isDayCare === true){
        await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.check_isdaycare',wait, 'soft' );
        const dayCare = await BaseCommandCaller.getCheckboxState(page,'PG_RequestForAdmission.check_isdaycare');
        if(!dayCare){
            await BaseCommandCaller.click(page,'PG_RequestForAdmission.check_isdaycare');
            await BaseCommandCaller.assertCheckboxState(page,'PG_RequestForAdmission.check_isdaycare',true);
        }
        
    }
    if(isNewBorn === true){
        await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_nonelectiveadmission',wait, 'soft' );
        const newBorn = await BaseCommandCaller.getCheckboxState(page,'PG_RequestForAdmission.check_isnewborn');
        if(!newBorn){
            await BaseCommandCaller.click(page,'PG_RequestForAdmission.check_isnewborn');
            await BaseCommandCaller.assertCheckboxState(page,'PG_RequestForAdmission.check_isnewborn',true);
        }
    }
    
    const scheduleDate =  generateDate(dateType,howManyDaysFutureOrPast);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_scheduleadmissiondate');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_scheduleadmissiondate', scheduleDate);
    await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_RequestForAdmission.input_scheduleadmissiondate',datatableName,'scheduleAdmissionDate', index);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_estimatedlegnthofstay');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_estimatedlegnthofstay', estimatedLegnthofStay);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_estimatedcost');
    await BaseCommandCaller.click(page,'PG_RequestForAdmission.input_estimatedcost');
    await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', estimatedCost)
    if(estimatedCost === 'Other Case'){

      await BaseCommandCaller.isLocatorPresent(page,'PG_RequestForAdmission.textarea_othercasesremark', wait, 'hard');
      await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.textarea_othercasesremark');
      await BaseCommandCaller.fill(page,'PG_RequestForAdmission.textarea_othercasesremark', otherRemark);
      await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_saveothercases');
    }
    if(isCashPayment){
      const cashPatient = await BaseCommandCaller.getRadioButtonState(page,'PG_RequestForAdmission.radio_iscashpatient');
      if(!cashPatient){
          await BaseCommandCaller.click(page,'PG_RequestForAdmission.radio_iscashpatient');
          await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_iscashpatient', true);
      }
  }
  if(isCorporate){
      const corporatePatient = await BaseCommandCaller.getRadioButtonState(page,'PG_RequestForAdmission.radio_iscoporatepatient');
      if(!corporatePatient){
          await BaseCommandCaller.click(page,'PG_RequestForAdmission.radio_iscoporatepatient');
          await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_iscoporatepatient', true);
      }
  }
    if(estimatedCost === 'Other Case'){
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_estimatedcostrange','0.00');
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_deposittobecollected','0.00');
    }
    
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_admittingdoctor');
    await BaseCommandCaller.click(page,'PG_RequestForAdmission.input_admittingdoctor');

    await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', doctorName);
    // Construct the path to the file dynamically
    const relativeFilePath = uploadFilePath;
    const absoluteFilePath = join(__dirname, relativeFilePath);

    console.log("Absolute File Path:", absoluteFilePath);
    await BaseCommandCaller.uploadFile(page,'PG_RequestForAdmission.input_uploadfile',absoluteFilePath);
  }

  /**
   * Fills in the patient room and board information in the admission form.
   *
   * @param page - The Playwright Page object representing the browser page.
   * @param ward - The ward to be selected from the dropdown.
   * @param bedType - The bed type to be selected from the dropdown.
   * @param wait - The time to wait for the locator to be present.
   * @returns A promise that resolves when the operation is complete.
   */
  static async bc_PartTwoPatientRoomandBoardInformation(page: Page,ward: string,bedType: string, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_ward',wait, 'soft' );
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_ward');
    await BaseCommandCaller.click(page,'PG_RequestForAdmission.input_ward');
    await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', ward);

    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_bedtype');
    await BaseCommandCaller.click(page,'PG_RequestForAdmission.input_bedtype');
    await BaseCommandCaller.selectMatOptionContainingText(page, 'PG_Common.list_matoptions', bedType);
  }

  /**
   * Handles the second part of patient admission acknowledgement process.
   * 
   * @param page - The Playwright Page object representing the browser page.
   * @param isCashPayment - Boolean indicating if the payment method is cash.
   * @param isCorporate - Boolean indicating if the patient is a corporate patient.
   * @param debetorCode - The debtor code for the corporate patient.
   * @param insuranceTerm - The term of the insurance.
   * @param insurancePercentage - The percentage of the insurance coverage.
   * @param insuranceAmount - The amount covered by the insurance.
   * @param depositAmount - The deposit amount for the admission.
   * @param roomBoardLimit - The limit for room and board expenses.
   * @param roomEntitlement - The room entitlement details.
   * @param specialRequest - Any special requests from the patient.
   * @param remark - Additional remarks for the admission.
   * @param wait - The wait time for loading elements to disappear.
   * 
   * @returns {Promise<void>} - A promise that resolves when the process is complete.
   */
  static async bc_PartTwoPatientAdmissionAcknowledgement(page: Page,isCashPayment: boolean,isCorporate: boolean,
    debetorCode: string,insuranceTerm: string,insurancePercentage: string,insuranceAmount: string, depositAmount: string,
    roomBoardLimit: string, roomEntitlement: string, specialRequest: string, remark: string, wait: number) {
      await BaseCommandCaller.waitForAllInstancesToDisappear(page,'PG_RequestForAdmission.spiner_loading',wait);
    if(isCashPayment){
        const cashPatient = await BaseCommandCaller.getRadioButtonState(page,'PG_RequestForAdmission.radio_cashpatient');
        if(!cashPatient){
            await BaseCommandCaller.click(page,'PG_RequestForAdmission.radio_cashpatient');
            await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_cashpatient', true);
        }
    }
    
    if(isCorporate){
        const coporate = await BaseCommandCaller.getRadioButtonState(page,'PG_RequestForAdmission.radio_coporatepatient');
        if(!coporate){
            await BaseCommandCaller.click(page,'PG_RequestForAdmission.radio_coporatepatient');
            await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_coporatepatient', true);
        }
        await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_insuaranceadvancesearch');
        await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_debetorcode');
        await BaseCommandCaller.fill(page, 'PG_RequestForAdmission.input_debetorcode', debetorCode);
        const debetorName: string | null = await BaseCommandCaller.getTextContent(page,'PG_RequestForAdmission.label_debetorname');
        const debetorcode_link_locator = 'PG_RequestForAdmission_Locators.link_coporatesearchresults';
        const resolving_debetorcode_link_locator = resolveLocator(debetorcode_link_locator);
        const resolved_debetorcode_link_locator = getLocatorWithDynamicValue(resolving_debetorcode_link_locator,'{parameter}', debetorCode);
        await BaseCommandCaller.click(page, resolved_debetorcode_link_locator);
        await BaseCommandCaller.hardPause(page, wait);
        if (debetorName !== null) {
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_insuarencecode', debetorName);
        }
        await BaseCommandCaller.hardPause(page, wait);
        await BaseCommandCaller.click(page,'PG_RequestForAdmission.select_insuranceterm');
        // const parameter_locator = "PG_RequestForAdmission_Locators.option_insuranceterm";
        // const resolving_parameter_locator = resolveLocator(parameter_locator);
        // const resolved_parameter_locator = getLocatorWithDynamicValue(resolving_parameter_locator,'{parameter}', insuranceTerm);
        // await BaseCommandCaller.isLocatorPresent(page,resolved_parameter_locator,wait,'hard');
        // await BaseCommandCaller.click(page,resolved_parameter_locator);
        await BaseCommandCaller.arrowDown(page, 'PG_RequestForAdmission.select_insuranceterm');
        await BaseCommandCaller.enter(page, 'PG_RequestForAdmission.select_insuranceterm');
        await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_insurancepercentage');
        await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_insurancepercentage', insurancePercentage);
        await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_insuranceamount');
        await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_insuranceamount', insuranceAmount);
    }
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_roomboardlimit');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_roomboardlimit', roomBoardLimit);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_roomentitlement');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_roomentitlement', roomEntitlement);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_specialrequest');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_specialrequest', specialRequest);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_specialrequest');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_specialrequest', remark);
  }




  /**
   * Fills in the Part Two Patient Guarantor Information section of the Request for Admission form.
   * 
   * @param page - The Playwright Page object representing the browser page.
   * @param isSameAsPatientInfo - Boolean indicating if the guarantor information is the same as the patient's information.
   * @param patientName - The name of the patient.
   * @param relationType - The relationship type of the guarantor to the patient.
   * @param patientPassportOrOldIcNo - The patient's passport or old IC number.
   * @param patientIcNo - The patient's IC number.
   * @param patientCountryCode - The patient's country code.
   * @param patientMobileNo - The patient's mobile number.
   * @param patientStreet1 - The patient's street address line 1.
   * @param patientStreet2 - The patient's street address line 2.
   * @param patientStreet3 - The patient's street address line 3.
   * @param patientStreet4 - The patient's street address line 4.
   * @param patientCountry - The patient's country.
   * @param patientState - The patient's state.
   * @param patientCity - The patient's city.
   * @param patientPostcode - The patient's postcode.
   * @param isSameAsEmergency - Boolean indicating if the guarantor information is the same as the emergency contact's information.
   * @param emergencyName - The name of the emergency contact.
   * @param emergencyRelationType - The relationship type of the emergency contact to the patient.
   * @param emergencyCountryCode - The emergency contact's country code.
   * @param emergencyMobileNo - The emergency contact's mobile number.
   * @param emergencyStreet1 - The emergency contact's street address line 1.
   * @param emergencyStreet2 - The emergency contact's street address line 2.
   * @param emergencyStreet3 - The emergency contact's street address line 3.
   * @param emergencyStreet4 - The emergency contact's street address line 4.
   * @param emergencyCountry - The emergency contact's country.
   * @param emergencyState - The emergency contact's state.
   * @param emergencyCity - The emergency contact's city.
   * @param emergencyPostcode - The emergency contact's postcode.
   * @param nicType - The type of NIC (National Identification Card).
   * @param guarantorRelationType - The relationship type of the new guarantor to the patient.
   * @param guarantorCountryCode - The country code of the new guarantor.
   * @param street1 - The street address line 1 of the new guarantor.
   * @param street2 - The street address line 2 of the new guarantor.
   * @param street3 - The street address line 3 of the new guarantor.
   * @param street4 - The street address line 4 of the new guarantor.
   * @param country - The country of the new guarantor.
   * @param state - The state of the new guarantor.
   * @param town - The town of the new guarantor.
   * @param postcode - The postcode of the new guarantor.
   * @param datatableName - The name of the data table.
   * @param index - The index of the data table entry.
   * @param wait - The wait time in milliseconds.
   * 
   * @returns A promise that resolves when the form has been filled.
   */
  static async bc_PartTwoPatientGuarantorInformation(
    page: Page,
    isSameAsPatientInfo: boolean,
    patientName: string,
    relationType: string,
    patientPassportOrOldIcNo: string,
    patientIcNo: string,
    patientCountryCode: string,
    patientMobileNo: string,
    patientStreet1: string,
    patientStreet2: string,
    patientStreet3: string,
    patientStreet4: string,
    patientCountry: string,
    patientState: string,
    patientCity: string,
    patientPostcode: string,
    isSameAsEmergency: boolean,
    emergencyName: string,
    emergencyRelationType: string,
    emergencyCountryCode: string,
    emergencyMobileNo: string,
    emergencyStreet1: string,
    emergencyStreet2: string,
    emergencyStreet3: string,
    emergencyStreet4: string,
    emergencyCountry: string,
    emergencyState: string,
    emergencyCity: string,
    emergencyPostcode: string,
    nicType: string,
    guarantorRelationType: string,
    guarantorCountryCode: string,
    street1: string,
    street2: string,
    street3: string,
    street4: string,
    country: string,
    state: string,
    town: string,
    postcode: string,
    datatableName: string,
    index: number,
    wait: number
  ) {
    // Check if the "Same as Patient Info" checkbox is present
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.check_sameaspatientinfo', wait, 'soft');
  
    if (isSameAsPatientInfo) {
      console.log('*******isSameAsPatientInfo*******', isSameAsPatientInfo);
  
      // Check and click the "Same as Patient Info" checkbox if not already checked
      const checkboxStatus = await BaseCommandCaller.getCheckboxState(page, 'PG_RequestForAdmission.check_sameaspatientinfo');
      if (!checkboxStatus) {
        await BaseCommandCaller.click(page, 'PG_RequestForAdmission.check_sameaspatientinfo');
        await BaseCommandCaller.assertCheckboxState(page, 'PG_RequestForAdmission.check_sameaspatientinfo', true);
      }
  
      // Fill in the form fields with patient's information
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_guarantorname', patientName);
      await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_relationshipcode');
      await BaseCommandCaller.click(page, 'PG_RequestForAdmission.input_relationshipcode');
      await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', relationType);
  
      const icNo = await BaseCommandCaller.getInputData(page, 'PG_RequestForAdmission.input_guarantoricno');
      if (icNo === 'null' || icNo === null || icNo === '') {
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_guarantoroldicno', patientPassportOrOldIcNo);
      } else {
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_guarantoricno', patientIcNo);
      }
  
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_primerycountrycode', patientCountryCode);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_primerymobileno', patientMobileNo);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_street1', patientStreet1);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_street2', patientStreet2);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_street3', patientStreet3);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_street4', patientStreet4);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_country', patientCountry);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_state', patientState);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_city', patientCity);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_postcode', patientPostcode);
  
    } else if (isSameAsEmergency) {
      console.log('*******isSameAsEmergency*******', isSameAsEmergency);
  
      // Check and click the "Same as Emergency Contact" checkbox if not already checked
      const checkboxStatus = await BaseCommandCaller.getCheckboxState(page, 'PG_RequestForAdmission.check_sameasemergencycontactdetails');
      if (!checkboxStatus) {
        await BaseCommandCaller.click(page, 'PG_RequestForAdmission.check_sameasemergencycontactdetails');
        await BaseCommandCaller.assertCheckboxState(page, 'PG_RequestForAdmission.check_sameasemergencycontactdetails', true);
        await BaseCommandCaller.hardPause(page, wait);
      }
  
      // Fill in the form fields with emergency contact's information
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_guarantorname', emergencyName);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_relationshipcode', emergencyRelationType);
  
      const emergencyIcNo = await BaseCommandCaller.getTextContent(page, 'PG_RequestForAdmission.input_guarantoroldicno');
      const emergencyPassport = await BaseCommandCaller.getTextContent(page, 'PG_RequestForAdmission.input_guarantoroldicno');
      if ((emergencyIcNo === 'null' || emergencyIcNo === null || emergencyIcNo === '') &&
          (emergencyPassport === 'null' || emergencyPassport === null || emergencyPassport === '')) {
        const guarantorNic = await NICGenerator.generateAndUpdateNIC('male', 'guarantorNic', datatableName, index, nicType);
        await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_guarantoricno');
        await BaseCommandCaller.fill(page, 'PG_RequestForAdmission.input_guarantoricno', guarantorNic);
        await BaseCommandCaller.tab(page, 'PG_RequestForAdmission.input_guarantoricno');
      }
  
      await BaseCommandCaller.hardPause(page, wait);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_primerycountrycode', emergencyCountryCode);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_primerymobileno', emergencyMobileNo);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_street1', emergencyStreet1);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_street2', emergencyStreet2);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_street3', emergencyStreet3);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_street4', emergencyStreet4);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_country', emergencyCountry);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_state', emergencyState);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_city', emergencyCity);
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_postcode', emergencyPostcode);
  
    } else {
      console.log('*******New Guarantor*******', isSameAsEmergency);
  
      // Generate and fill in new guarantor information
      const guarantorName = await NameGenerator.generateAndUpdateJson('guarantorName', datatableName, index);
      await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_guarantorname');
      await BaseCommandCaller.fill(page, 'PG_RequestForAdmission.input_guarantorname', guarantorName);
      await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_relationshipcode');
      await BaseCommandCaller.click(page, 'PG_RequestForAdmission.input_relationshipcode');
      await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', guarantorRelationType);
  
      const guarantorNic = await NICGenerator.generateAndUpdateNIC('male', 'guarantorNic', datatableName, index, nicType);
      await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_guarantoricno');
      await BaseCommandCaller.fill(page, 'PG_RequestForAdmission.input_guarantoricno', guarantorNic);
      await BaseCommandCaller.tab(page, 'PG_RequestForAdmission.input_guarantoricno');
  
      await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_primerycountrycode');
      await BaseCommandCaller.click(page, 'PG_RequestForAdmission.input_primerycountrycode');
      await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', guarantorCountryCode);
  
      const guarantorMobileNo = await MobileNumberGenerator.generateAndUpdateJson('guarantorMobileNo', datatableName, index);
      await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_primerymobileno');
      await BaseCommandCaller.fill(page, 'PG_RequestForAdmission.input_primerymobileno', guarantorMobileNo);
  
      await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street1_relationtype');
      await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street1_relationtype', street1);
      await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street2_relationtype');
      await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street2_relationtype', street2);
      await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street3_relationtype');
      await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street3_relationtype', street3);
      await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street4_relationtype');
      await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street4_relationtype', street4);
  
      await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_country_relationtype');
      await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_country_relationtype');
      await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', country);
  
      await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_state_relationtype');
      await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_state_relationtype');
      await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', state);
  
      await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_city_relationtype');
      await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_city_relationtype');
      await BaseCommandCaller.selectMatOptionByText(page, 'PG_Common.list_matoptions', town);
  
      await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_postcode_relationtype');
      await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_postcode_relationtype', postcode);
    }
  }
  

  static async bc_HospitalStaffAcknowledgement(page: Page,nicType:string,datatableName: string,index: number, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_staficno',wait, 'soft' );
    const staffNic = await NICGenerator.generateAndUpdateNIC('male','staffNic',datatableName,index,nicType);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_staficno');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_staficno', staffNic);
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_staffaxknowledgement');
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_okacknowledge');
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_RequestForAdmission.input_staffacknowledgedatetime',datatableName,'staffAcknowledgementTime',index);

  }

  static async bc_HospitalWitnessAcknowledgement(page: Page,nicType:string,datatableName: string,index: number, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_witnessicno',wait, 'soft' );
    const staffWitnessNic = await NICGenerator.generateAndUpdateNIC('male','staffWitnessNic',datatableName,index,nicType);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_witnessicno');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_witnessicno', staffWitnessNic);
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_witnessacknowledge');
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_okacknowledge');
    await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_RequestForAdmission.input_witnessacknowledgedatetime',datatableName,'staffWitnessAcknowledgementTime',index);
  }

  static async bc_PatientAcknowledgement(page: Page,datatableName: string,index: number, wait: number) {

    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_patientacknowledge');
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.drawSignature(page,'PG_RequestForAdmission.canvas_patientsignature');
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_okpatientacknowledge');
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_RequestForAdmission.input_patientacknowledgedatetime',datatableName,'patientAcknowledgementTime',index);
  }

  static async bc_GuarantorAcknowledgement(page: Page,datatableName: string,index: number, wait: number) {

    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_guarantoracknowledge');
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.drawSignature(page,'PG_RequestForAdmission.canvas_guarantorsignature');
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_okguarantoracknowledge');
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_RequestForAdmission.input_guarantoracknowledgedatetime',datatableName,'garantorAcknowledgementTime',index);
  }

  static async bc_ClickOnDraftButton(page: Page, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.button_draft',wait, 'soft' );
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_draft');
   
  }

  static async bc_StoreRFAId(page: Page, datatableName: string,index: number, wait: number){
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.waitForAllInstancesToDisappear(page,'PG_RequestForAdmission.spiner_loading',wait);
    await BaseCommandCaller.hardPause(page, wait);
    const rfaId = await BaseCommandCaller.getInputDataAndStoreInJson(page, 'PG_RequestForAdmission.input_rfaid',datatableName,'rfaId', index,true);

    return rfaId; 
  }

  static async bc_SearchRFAId(page: Page, fromDate: string,toDate: string,admissionState: string, rfaId: string, wait: number) {


    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.button_rfaidadvancedsearch',wait, 'soft' );
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_rfaidadvancedsearch');
    await BaseCommandCaller.waitForAllInstancesToDisappear(page,'PG_RequestForAdmission.spiner_loading',wait);
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_scheduleadmissiondatefrom',wait, 'soft' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_scheduleadmissiondateto',wait, 'soft' );
    const todayDate = await generateDate('today');
    if(fromDate !== todayDate && fromDate !== '' && fromDate !== null){
        await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_scheduleadmissiondatefrom');
        await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_scheduleadmissiondatefrom',fromDate);
    }
    if(toDate !== todayDate && toDate !== '' && toDate !== null){
        await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_scheduleadmissiondateto');
        await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_scheduleadmissiondateto',toDate);
    }
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_admissionstate',wait, 'soft' );
    await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_admissionstate');
    await BaseCommandCaller.fill(page, 'PG_RequestForAdmission.input_admissionstate',admissionState);
    await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', admissionState);
    await BaseCommandCaller.clearTextField(page,'PG_RequestForAdmission.input_searchrfaid');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_searchrfaid',rfaId);
    await BaseCommandCaller.tab(page,'PG_RequestForAdmission.input_searchrfaid');
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_searchrfapopup');
    await BaseCommandCaller.hardPause(page, wait);
    const results_link_locator = 'PG_RequestForAdmission_Locators.link_rfaidresults';
    await BaseCommandCaller.hardPause(page, wait);
    const resolving_results_link_locator = resolveLocator(results_link_locator);
    const resolved_results_link_locator = getLocatorWithDynamicValue(resolving_results_link_locator,'{parameter}', rfaId);
    await BaseCommandCaller.waitForAllInstancesToDisappear(page,'PG_RequestForAdmission.spiner_loading',wait);
    await BaseCommandCaller.click(page, resolved_results_link_locator, true);

  }

  static async bc_HandelClickOnSaveButton(page: Page, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.button_save',wait, 'soft' );
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_save');
  }

  static async bc_HandelClickOnClearButton(page: Page, wait: number) {
    await BaseCommandCaller.hardPause(page, wait);
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.button_clearnav',wait, 'soft' );
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_clearnav');
  }

  static async bc_HandelClickOnClearPopUpOkButton(page: Page, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.button_clearpopupok',wait, 'soft' );
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_clearpopupok');
  }

  static async bc_VerifyRFAPatientInfo(page: Page,isNewBorn: boolean, mrn: string,patientName: string, nicNo: string, passport: string,patientGurdianNic: string, 
    patientGender:string, patientMrn: string,patientAge: string,rfaId: string,isDirect: boolean, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_mrn',wait, 'soft' );
    if(isDirect){
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_mrn',patientMrn);
    }
    if(!isDirect){
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_mrn',mrn);
    }
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_patientname',patientName);
    const patientNicNo = await BaseCommandCaller.getInputData(page,'PG_RequestForAdmission.input_nicno');
    if(isNewBorn === true){
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_oldicorpassport',patientGurdianNic);
    }
    else{
      if(patientNicNo === 'null' || patientNicNo === null || patientNicNo === '' || patientNicNo === 'undefined')
      { 
          await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_oldicorpassport',passport);
      }
      const passportNo = await BaseCommandCaller.getInputData(page,'PG_RequestForAdmission.input_oldicorpassport');
      if(passportNo === 'null' || passportNo === null || passportNo === '' || passportNo === 'undefined')
      { 
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_nicno',nicNo);
      }
    }
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_gender',patientGender);
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_age',patientAge);
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_rfaid',rfaId);
    }

static async bc_VerifyPartOneDoctor(page: Page,isElectiveAdmission: boolean,isDayCare: boolean,isNewBorn: boolean,scheduleDate: string,
  estimatedLegnthofStay: string,estimatedCost: string,isCashPayment:boolean,isCorporate: boolean,doctorName: string, wait: number) {
  await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_electiveadmission',wait, 'soft' );
    if(isElectiveAdmission === true){
        await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_electiveadmission',true);
    }
    else{
        await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_nonelectiveadmission',wait, 'soft' );
        await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_nonelectiveadmission',true);
    }
    if(isDayCare === true){
      await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.check_isdaycare',wait, 'soft' );
      await BaseCommandCaller.assertCheckboxState(page,'PG_RequestForAdmission.check_isdaycare',true);
    }
    if(isNewBorn === true){
      await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_nonelectiveadmission',wait, 'soft' );  
      await BaseCommandCaller.assertCheckboxState(page,'PG_RequestForAdmission.check_isnewborn',true);
      
    }
    
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_scheduleadmissiondate',scheduleDate);
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_estimatedlegnthofstay', estimatedLegnthofStay);
    await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_estimatedcost', estimatedCost)
    if(isCashPayment){
      const cashPatient = await BaseCommandCaller.getRadioButtonState(page,'PG_RequestForAdmission.radio_iscashpatient');
      await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_iscashpatient', true);
    }
    if(isCorporate){
      const corporatePatient = await BaseCommandCaller.getRadioButtonState(page,'PG_RequestForAdmission.radio_iscoporatepatient');
      await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_iscoporatepatient', true);
    }
    if(estimatedCost === 'Other Case'){
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_estimatedcostrange','0.00');
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_deposittobecollected','0.00');
    }
    await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_admittingdoctor', doctorName);
  }

  /**
   * Verifies the patient room and board information in part two of the request for admission process.
   *
   * @param page - The Playwright Page object representing the browser page.
   * @param ward - The expected ward value to be verified.
   * @param bedType - The expected bed type value to be verified.
   * @param wait - The wait time in milliseconds for the locator to be present.
   * @returns A promise that resolves when the verification is complete.
   */
  static async bc_VerifyPartTwoPatientRoomandBoardInformation(page: Page,ward: string,bedType: string, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_ward',wait, 'soft' );
    await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_ward', ward);;
    await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_bedtype', bedType);
  }


  static async bc_VerifyPartTwoPatientAdmissionAcknowledgement(page: Page,isCashPayment: boolean,isCorporate: boolean,
    debetorCode: string,insuranceTerm: string,insurancePercentage: string,insuranceAmount: string, depositAmount: string,
    roomBoardLimit: string, roomEntitlement: string, specialRequest: string, remark: string, wait: number) {
      await BaseCommandCaller.waitForAllInstancesToDisappear(page,'PG_RequestForAdmission.spiner_loading',wait);
    if(isCashPayment){
      await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_cashpatient', true);
    }
    
    if(isCorporate){
      await BaseCommandCaller.assertRadioButtonState(page,'PG_RequestForAdmission.radio_coporatepatient', true);
      const debetorcode_link_locator = 'PG_RequestForAdmission_Locators.input_debetorcode';
      await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_debetorcode', debetorCode);
      const resolving_debetorcode_link_locator = resolveLocator(debetorcode_link_locator);
      const resolved_debetorcode_link_locator = getLocatorWithDynamicValue(resolving_debetorcode_link_locator,'{parameter}', debetorCode);
      await BaseCommandCaller.click(page, resolved_debetorcode_link_locator);
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_insuarencecode', debetorCode);
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.select_insuranceterm',insuranceTerm);
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_insurancepercentage', insurancePercentage);
      await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_insuranceamount', insuranceAmount);
    }
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_depositamount', depositAmount);
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_roomboardlimit', roomBoardLimit);
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_roomentitlement', roomEntitlement);
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_specialrequest', specialRequest);
    await BaseCommandCaller.getInputDataAndAssert(page,'PG_RequestForAdmission.input_specialrequest', remark);
  }

  static async bc_CancelRFA(page: Page, cancelationReason: string, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.label_cancelationheader',wait, 'soft' );
    await BaseCommandCaller.selectOption(page,'PG_RequestForAdmission.select_cancelationreason',cancelationReason);
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.button_savecancelation',wait, 'soft' );
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_savecancelation');
  }

  static async bc_VerifyPartOneFieldsDisabled(page: Page,wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_electiveadmissiondisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_nonelectiveadmissiondisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.check_isdaycaredisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.check_isnewborndisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_scheduleadmissiondatedisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_estimatedlegnthofstaydisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_estimatedcostdisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_estimatedcostrangedisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_iscashpatientdisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.radio_iscoporatepatientdisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_deposittobecollecteddisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.select_operationrequireddisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_operationdatedisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_admitdiagnosisdisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_secondarydiagnosisdisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_admittingdoctordisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_acknowledgedatedisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.check_ismedicalofficerdisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.select_specialistdoctorcodedisabled',wait, 'hard' );
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_uploadfiledisabled',wait, 'hard' );
  }

  static async bc_HandelClickOnEditButton(page: Page, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page,'PG_RequestForAdmission.button_edit',wait,'hard');
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_edit');
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.button_editdisabled',wait,'hard');
  }

  static async bc_EditPartOneDeposittoBeCollected(page: Page, editDepositToBeCollect: string, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_deposittobecollected',wait, 'soft' );
    await BaseCommandCaller.clearTextField(page, 'PG_RequestForAdmission.input_deposittobecollected');
    await BaseCommandCaller.fill(page,'PG_RequestForAdmission.input_deposittobecollected', editDepositToBeCollect);
    await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_deposittobecollected', editDepositToBeCollect);
  }

  static async bc_VerifyEditPartOneDeposittoBeCollected(page: Page, editDepositToBeCollect: string, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.input_deposittobecollecteddisabled',wait, 'hard' );
    await BaseCommandCaller.getInputDataAndAssert(page, 'PG_RequestForAdmission.input_deposittobecollected', editDepositToBeCollect);
  }

}