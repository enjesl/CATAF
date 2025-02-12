// LIB_PatientRegistration.ts

import { Page, expect  } from '@playwright/test';
import { BaseCommandCaller as BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';  import { NameGenerator  } from '../Runtime/Utilities/NameGenerator';
import { NICGenerator, generateTwinNic  } from '../Runtime/Utilities/NICGenerator';
import { MobileNumberGenerator  } from '../Runtime/Utilities/MobileNumberGenerator';
import { PassportNumberGenerator  } from '../Runtime/Utilities/PassportNumberGenerator';
import { PassportExpiryGenerator } from '../Runtime/Utilities/generateAndUpdateExpiryDate';
import { DOBGenerator} from '../Runtime/Utilities/DOBGenerator';
import { DataHelper} from '../Runtime/Helpers/DataHelper'; 
import { LIB_CommonRegistrationFieldsEdit } from './LIB_CommonRegistrationFieldsEdit';
import { generateDate } from '../Runtime/Utilities/DateGenerator';
import { resolveLocator, getLocatorWithDynamicValue} from '../Runtime/Helpers/LocatorHelper';

export class LIB_PatientRegistration {

    /**
     * This function verifies that the page has navigated to the correct URL and that the page displays the correct header label.
     * It checks if the current page URL matches the expected URL, and then verifies that the header label on the page 
     * matches the expected `headerlabel`.
     * 
     * 1. **Verifying Page URL**:
     *    - The function first verifies that the current URL of the page matches the provided `expected_url`. 
     *      It uses Playwright's `toHaveURL` assertion to check the URL.
     * 
     * 2. **Verifying Header Label**:
     *    - After confirming the URL, the function checks if the header label (`header_lable_patientregistration`) matches 
     *      the provided `headerlabel`. This ensures the page has loaded the correct section.
     * 
     * 3. **Error Handling**:
     *    - If the URL or the header label is incorrect, the function will throw an error indicating a mismatch, 
     *      ensuring that the page has navigated to the correct location and displays the expected content.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} headerlabel - The expected text for the header label on the page (e.g., "Patient Registration").
     * @param {string} expected_url - The expected URL of the page to verify the navigation.
     * @param {number} wait - The waiting time (in milliseconds) to ensure the page elements are loaded before interacting with them.
     */

    static async bc_VerifyPageNavigation(page: Page, headerlabel: string, expected_url: string, wait: number) {
        
        await expect(page).toHaveURL(expected_url);  
        await BaseCommandCaller.assertTextMatch(page, 'PG_PatientRegistration.header_lable_patientregistration', headerlabel, true);
    }

    /**
     * This function handles the process of selecting a charge type in the patient registration form.
     * It asserts that the charge type label matches the provided `chargeTypeLabel`, and then selects the corresponding 
     * charge type from the dropdown list (`PG_PatientRegistration.select_chargetype`).
     * 
     * 1. **Asserting Charge Type Label**:
     *    - The function checks if the charge type label (`label_chargetype`) on the page matches the provided `chargeTypeLabel`. 
     *      This ensures that the correct section or label is being interacted with.
     * 
     * 2. **Selecting Charge Type**:
     *    - Once the label assertion passes, the function selects the provided `chargeType` from the dropdown list (`select_chargetype`).
     *    - The `true` flag indicates that the selection is made from the dropdown list.
     * 
     * 3. **Error Handling**:
     *    - The function ensures that the correct charge type label is present and that the charge type is properly selected.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} chargeTypeLabel - The label text to be matched for the charge type section (e.g., "Charge Type").
     * @param {string} chargeType - The charge type to be selected from the dropdown (e.g., "Inpatient", "Outpatient").
     * @param {number} wait - The waiting time (in milliseconds) for waiting for the page elements to load before interaction.
     */

    static async bc_HandleChargeType(page: Page, chargeTypeLabel: string, chargeType: string,  wait: number) {
        
        await BaseCommandCaller.assertTextMatch(page, 'PG_PatientRegistration.label_chargetype', chargeTypeLabel);
        await BaseCommandCaller.selectOption(page, 'PG_PatientRegistration.select_chargetype', chargeType, true);
       
    }
    /**
     * This function handles the outpatient registration types by selecting the appropriate checkboxes 
     * based on the provided `caretypes` string. It ensures the corresponding checkboxes for outpatient care types 
     * (e.g., 'MLC', 'Walk-in', 'Newborn', etc.) are clicked and checked in the registration form.
     * 
     * 1. **Initial Setup**:
     *    - The function checks for the presence of several checkbox elements related to outpatient care types, such as 'MLC', 'Walk-in', 
     *      'Newborn', 'Daycare', and 'ER' (Emergency Room) using locators (`check_outpatient_mlc`, `check_outpatient_walkin`, etc.).
     * 
     * 2. **Processing Care Types**:
     *    - The `caretypes` string is split into individual care type keys using the pipe (`|`) delimiter. Each care type is then trimmed 
     *      and converted to lowercase to ensure the correct locator is used.
     * 
     * 3. **Iterating Over Care Types**:
     *    - The function iterates over the split and processed care types (e.g., 'mlc', 'walkin', etc.) and constructs the corresponding locator dynamically.
     *    - It performs a click action on the appropriate checkbox (`check_outpatient_<caretype>`), marking it as selected.
     *    - After each click, it asserts that the checkbox is checked.
     * 
     * 4. **Error Handling**:
     *    - If the checkbox for a particular care type cannot be clicked (due to a missing locator or other issues), the function logs an error message 
     *      indicating which checkbox failed.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} caretypes - A string containing the care types to select, separated by pipes (e.g., "MLC|Walk-in|Newborn").
     * @param {number} wait - The waiting time (in milliseconds) for waiting for the checkboxes to be loaded.
     */

    static async bc_HandleOutPatientRegistrationType(page: Page, caretypes: string, wait: number) {
        
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.check_outpatient_mlc', wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.check_outpatient_walkin', wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.check_outpatient_newborn', wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.check_outpatient_daycare', wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.check_outpatient_er', wait, 'soft');

        // Split the input string into individual keys and convert to lowercase
        const inputKeys = caretypes.split('|').map(key => key.trim().toLowerCase());

        // Iterate over the input keys and perform the corresponding clicks
        for (const key of inputKeys) {
            try {
                // Construct the locator dynamically
                const locator = `PG_PatientRegistration.check_outpatient_${key}`;

                // Perform the click action
                await BaseCommandCaller.click(page, locator);
                console.log(`Clicked on: ${locator}`);
                await BaseCommandCaller.assertCheckboxState(page, locator, true);
            } catch (error) {
                console.error(`Error clicking on: PG_PatientRegistration.check_outpatient_${key}`, error);
            }
        }
            
    }

    /**
     * This function handles the process of filling in the patient's name in the registration form.
     * It clears the existing name field, generates a new patient name dynamically, and fills the field with the generated name.
     * 
     * 1. **Initial Setup**:
     *    - The function ensures that the patient name input field (`input_patientname`) is present on the page.
     * 
     * 2. **Generating and Filling Patient Name**:
     *    - It clears the existing patient name field.
     *    - The function generates a new patient name using the `NameGenerator`, which retrieves the name from the provided 
     *      data table (`datatablename`) at the given index (`index`).
     *    - After generating the patient name, the function fills the field (`input_patientname`) with the newly generated name.
     * 
     * 3. **Error Handling**:
     *    - The function interacts with the form to clear and fill the patient name field, ensuring the data is correctly populated.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data for the patient name.
     * @param {number} index - The index of the record in the data table for dynamic data retrieval.
     * @param {number} wait - The waiting time (in milliseconds) for waiting for the patient name input field to load.
     */
       
    static async bc_VerifyRegistrationPatientField(page: Page,  wait: number) {
        
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_uidno',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_visitno',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_patientname',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_caisno',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_rfano',wait, 'soft');
    }

    static async bc_HandleInputName(page: Page,isAppoitnment: boolean, datatablename: string, index: number,  wait: number) {
        if(!isAppoitnment){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_patientname',wait, 'soft');
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_patientname');
            const patientName = await NameGenerator.generateAndUpdateJson('patientName', datatablename, index)
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_patientname', patientName, true);
        }
    }

    static async bc_HandleExistingAppoinment(page: Page,appointmentId: string, wait: number) {
        
        await BaseCommandCaller.hardPause(page, wait);
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.label_appoitnmentpopup',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.button_ok',wait, 'hard');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_ok');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_appointmentreference',wait, 'soft');
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_appointmentreference');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_appointmentreference', appointmentId, true);
        await BaseCommandCaller.hardPause(page, wait);
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_appointmentgo');
        await BaseCommandCaller.hardPause(page, wait);
        const results_link_locator = 'PG_PatientRegistration_Locators.check_appoitnmentresult';
        const resolving_results_link_locator = resolveLocator(results_link_locator);
        const resolved_results_link_locator = getLocatorWithDynamicValue(resolving_results_link_locator,'{apptRefNo}', appointmentId);
        await BaseCommandCaller.isLocatorPresent(page, resolved_results_link_locator,wait, 'soft');
        await BaseCommandCaller.click(page, resolved_results_link_locator);
        await BaseCommandCaller.assertCheckboxState(page, resolved_results_link_locator, true);
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_appointmentselect');

    }
    /**
     * This function handles the MyKAD-related fields for patients with the 'MyKAD' identification type in the patient 
     * registration form. It fills out the patient's NIC number, country of issue, nationality, gender, race, age, 
     * country code, mobile number, and other related fields.
     * 
     * 1. **Initial Setup**:
     *    - The function checks if various fields related to MyKAD information are present on the page, such as the NIC number, 
     *      passport expiry, nationality, race, gender, age, country code, and mobile number.
     * 
     * 2. **Filling NIC Information**:
     *    - It clears the NIC field (`input_ic_no`) and generates a new NIC number for the patient using the `NICGenerator`. 
     *      This generated NIC number is then filled into the form.
     * 
     * 3. **Filling Country of Issue and Nationality**:
     *    - The function asserts the country of issue (`input_countryofissue`) and nationality (`input_nationality`) fields, ensuring 
     *      that the correct data is populated.
     * 
     * 4. **Error Handling**:
     *    - The function interacts with the form fields to ensure that all relevant data is filled correctly, 
     *      including generating dynamic data for NIC.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} gender - The gender of the patient (e.g., 'Male', 'Female').
     * @param {string} countryofIssue - The country of issue for the MyKAD.
     * @param {string} nationality - The nationality of the patient.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table to retrieve and fill data.
     * @param {string} nicType - The type of NIC (e.g., 'MyKAD').
     * @param {number} wait - The waiting time (in milliseconds) to wait for the elements to load.
     */

    static async bc_HandleMyKAD(page: Page, isAppointment: boolean,patientName:string, appoitnmentNicNo: string, appointmentId: string,appoitnmentPatientAge: string, gender: string ,countryofIssue: string, nationality: string,isTwinFirst: boolean,isTwinSecond: boolean, columnPatientNIC: string,columnPatientDOB: string, datatablename: string, index: number, nicType: string, wait: number) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_disabled_oldic_passport',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_passportexpiery',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_nationality',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_race',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_disabled_gender',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_age',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_countrycode',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_mobileno',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.textarea_disabled_addpatientremark',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_ic_no',wait, 'soft');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_ic_no');
        if(!isAppointment){
            if(isTwinFirst){
                const patientNicNo = await NICGenerator.generateAndUpdateNIC( gender,'patientNic', datatablename, index,nicType)
                console.log(patientNicNo);
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_ic_no', patientNicNo);
                await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_ic_no');
                await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_age',datatablename,'age',index);
            }
            if(isTwinSecond){
                const updatedData = DataHelper.reloadData(datatablename);
                const updadtedPatientNIC = updatedData[index][columnPatientNIC];
                const twinPatientNicNo = await generateTwinNic(updadtedPatientNIC)
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_ic_no', twinPatientNicNo);
                await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_ic_no');
                await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_age',datatablename,'age',index);
            }else{
                const patientNicNo = await NICGenerator.generateAndUpdateNIC( gender,'patientNic', datatablename, index,nicType)
                console.log(patientNicNo);
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_ic_no', patientNicNo);
                await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_ic_no');
                await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_age',datatablename,'age',index);
            }
            
        }
        if(isAppointment){
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_ic_no', appoitnmentNicNo);
            await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_ic_no');
            
            await LIB_PatientRegistration.bc_HandleExistingAppoinment(page,appointmentId, wait);
            await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_age',appoitnmentPatientAge);
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_patientname',wait, 'soft');
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_patientname', patientName);
        }
        
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_countryofissue',countryofIssue);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_nationality',nationality);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_dob',datatablename,'DOB',index);
        if(isTwinSecond){
            const updatedData = DataHelper.reloadData(datatablename);
            const updadtedPatientDOB = updatedData[index][columnPatientDOB];
            await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_dob',updadtedPatientDOB);
        }
        
    }
    /**
     * This function handles the MyKAD-related fields for patients whose MyKAD information falls under specific categories 
     * such as 'MyKAD (Father)', 'MyKAD (Mother)', or 'MyKAD (Other)'. It fills in the patient's MyKAD information 
     * like NIC number, country of issue, nationality, date of birth (DOB), age, and other related fields.
     * 
     * 1. **Initial Setup**:
     *    - The function ensures that various fields in the registration form (such as NIC number, passport expiry, nationality, race, 
     *      gender, age, country code, mobile number, and additional remarks) are present and waits for them to be visible on the page.
     * 
     * 2. **Filling NIC Information**:
     *    - It clears the NIC field (`input_oldic_passport`) and generates a new NIC number for the patient (or guardian) using 
     *      the `NICGenerator`. This generated NIC number is filled into the form.
     * 
     * 3. **Filling Country of Issue and Nationality**:
     *    - The function asserts the country of issue (`input_countryofissue`) and nationality (`input_nationality`) fields, ensuring 
     *      that the values are correctly filled.
     * 
     * 4. **Filling Date of Birth (DOB) and Age**:
     *    - It generates the patient's DOB and age using the `DOBGenerator` and fills the corresponding fields (`input_dob` and `input_age`).
     * 
     * 5. **Error Handling**:
     *    - The function interacts with the form fields, ensuring that all relevant data is filled correctly, and uses dynamic data 
     *      generation for NIC, DOB, and age.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} gender - The gender of the patient (e.g., 'Male', 'Female').
     * @param {string} countryofIssue - The country of issue for the MyKAD.
     * @param {string} nationality - The nationality of the patient.
     * @param {string} nicType - The type of NIC (e.g., 'MyKAD', 'MyKAD (Father)', 'MyKAD (Mother)', etc.).
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table to retrieve and fill data.
     * @param {number} wait - The waiting time (in milliseconds) for waiting for the elements to load.
     */

    static async bc_HandleMyKADOthers(page: Page,  gender: string,countryofIssue: string, nationality: string,nicType: string, isNewBorn: boolean, datatablename: string, index: number,  wait: number) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_disabled_ic_no',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_passportexpiery',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_nationality',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_race',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_disabled_gender',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_age',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_countrycode',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_mobileno',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.textarea_disabled_addpatientremark',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_oldic_passport',wait, 'soft');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_oldic_passport');
        const patienOthertNicNo = await NICGenerator.generateAndUpdateNIC( gender,'patientGurdianNic', datatablename, index, nicType);
        console.log(patienOthertNicNo);
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_oldic_passport', patienOthertNicNo);
        await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_oldic_passport');
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_countryofissue',countryofIssue);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_nationality',nationality);
        if(!isNewBorn){
            const ageAndDOB = await DOBGenerator.generateAndUpdateDOB('DOB','age', datatablename, index);
            console.log(ageAndDOB);
            // Destructure dob and age from the returned object
            const { dob, age } = ageAndDOB;

            // Log or use them separately
            console.log(`Date of Birth: ${dob}`);
            console.log(`Age: ${age}`);
            console.log(dob);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_dob');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_dob', dob);
            console.log(age);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_age');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_age', age);
        }
        if(isNewBorn){

            const ageAndDOB = await DOBGenerator.generateAndUpdateDOB('DOB','age', datatablename, index, isNewBorn);
            console.log(ageAndDOB);
            // Destructure dob and age from the returned object
            const { dob, age } = ageAndDOB;

            // Log or use them separately
            console.log(`Date of Birth: ${dob}`);
            console.log(`Age: ${age}`);
            console.log(dob);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_dob');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_dob', dob);
            console.log(age);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_age');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_age', age);

        }

    }
    
    /**
     * This function handles the Passport-related details in the patient registration form.
     * It fills out the passport number, expiry date, country of issue, nationality, date of birth (DOB),
     * age, and other relevant fields based on the nationality of the patient. If the nationality is not 'MALAYSIA',
     * it handles the non-MyKad information.
     * 
     * 1. **Initial Setup**:
     *    - The function ensures that the necessary form fields related to passport details are present on the page, 
     *      such as passport number, expiry date, country of issue, nationality, and others.
     * 
     * 2. **Filling Passport Number**:
     *    - It clears the passport number field (`input_oldic_passport`) and generates a new passport number using the 
     *      `PassportNumberGenerator`, filling the field with the generated passport number.
     * 
     * 3. **Filling Passport Expiry Date**:
     *    - It clears the passport expiry date field (`input_passportexpiery`) and generates a new expiry date using the 
     *      `PassportExpiryGenerator`, filling the field with the generated date.
     * 
     * 4. **Filling Country of Issue**:
     *    - It clears and selects the country of issue from a dropdown (`input_countryofissue`) using the provided `countryofIssue` value.
     * 
     * 5. **Filling Nationality**:
     *    - It clears and selects the nationality from a dropdown (`input_nationality`) using the provided `nationality` value.
     * 
     * 6. **Filling Date of Birth (DOB) and Age**:
     *    - It generates the date of birth and age using the `DOBGenerator` and fills the corresponding fields (`input_dob` and `input_age`) 
     *      with the generated values.
     * 
     * 7. **Handling Non-MyKad Information**:
     *    - If the nationality is not 'MALAYSIA', the function selects the appropriate non-MyKad information from the dropdown (`select_nonmykadinfo`).
     * 
     * 8. **Error Handling**:
     *    - The function interacts with various form elements, filling out the passport-related information and ensuring the correct data is selected or entered.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} countryofIssue - The country of issue for the passport.
     * @param {string} nationality - The nationality of the patient.
     * @param {string} nonMyKadInformation - The non-MyKad information to be selected if nationality is not 'MALAYSIA'.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table to retrieve and fill data.
     * @param {number} wait - The waiting time (in milliseconds) to wait for the form fields to load.
     */

    static async bc_HandlePassport(page: Page, countryofIssue: string, nationality: string,  nonMyKadInformation: string, datatablename: string, index: number,  wait: number) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_disabled_ic_no',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_race',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_disabled_gender',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_age',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_countrycode',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_disabled_mobileno',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.textarea_disabled_addpatientremark',wait, 'soft');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_oldic_passport',wait, 'soft');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_oldic_passport');
        const passportNumber = await PassportNumberGenerator.generateAndUpdatePassportNumber('passportNumber', datatablename, index)
        console.log(passportNumber);
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_oldic_passport', passportNumber);
        await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_oldic_passport');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_passportexpiery',wait, 'soft');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_passportexpiery');
        const expieryDate = await PassportExpiryGenerator.generateAndUpdateExpiryDate('expieryDate',datatablename, index);
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_passportexpiery', expieryDate);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_countryofissue');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_countryofissue');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions',countryofIssue);
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_nationality');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_nationality');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions',nationality);
        const ageAndDOB = await DOBGenerator.generateAndUpdateDOB('DOB','age', datatablename, index);
        console.log(ageAndDOB);
        // Destructure dob and age from the returned object
        const { dob, age } = ageAndDOB;

        // Log or use them separately
        console.log(`Date of Birth: ${dob}`);
        console.log(`Age: ${age}`);
        console.log(dob);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_dob');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_dob', dob);
        console.log(age);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_age');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_age', age);
        
        if(nationality !== 'MALAYSIA'){
            await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_nonmykadinfo',nonMyKadInformation);
        }
        else {
            console.log("Nationality is Malaysia.");
        }
        
    }

    /**
     * This function handles the process of filling out the Patient Information section of the patient registration form.
     * It populates fields related to the patient's identification type, gender, race, nationality, country of issue,
     * age, mobile number, and email. Depending on the identification type, it delegates the filling of specific fields 
     * for MyKAD, Passport, or other MyKAD types (e.g., MyKAD (Father), MyKAD (Mother)).
     * 
     * 1. **Filling Identification Type**:
     *    - The function selects the identification type from the dropdown menu (`input_identificationtype`).
     *    - If the identification type is 'MyKAD', it invokes the `bc_HandleMyKAD` function to handle MyKAD-specific fields.
     *    - If the identification type is a Passport (including different categories like 'Passport', 'Passport (Father)', etc.), 
     *      it invokes the `bc_HandlePassport` function to handle Passport-specific fields.
     *    - If the identification type is a variant of MyKAD (such as 'MyKAD (Father)', 'MyKAD (Mother)'), it invokes 
     *      the `bc_HandleMyKADOthers` function to handle those specific fields.
     * 
     * 2. **Filling Race**:
     *    - It selects the patient's race from the dropdown menu (`input_race`).
     * 
     * 3. **Filling Gender**:
     *    - It selects the gender from the dropdown menu (`select_gender`).
     * 
     * 4. **Filling Country Code and Mobile Number**:
     *    - The function selects the country code for the mobile number (`input_countrycode`) from the dropdown.
     *    - It generates a random mobile number using the `MobileNumberGenerator` and fills the `input_mobileno` field with the generated number.
     * 
     * 5. **Filling Email**:
     *    - The function fills in the patient's email (`input_email`) with the provided `email`.
     * 
     * 6. **Dynamic Data Generation**:
     *    - The function dynamically generates values for mobile numbers and retrieves other patient details from the data table based on the provided `index`.
     * 
     * 7. **Error Handling**:
     *    - The function interacts with various form elements, performing selections and filling fields, ensuring that the correct data is entered.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} identificationType - The identification type of the patient (e.g., 'MyKAD', 'Passport', etc.).
     * @param {string} gender - The gender of the patient (e.g., 'Male', 'Female').
     * @param {string} countryofIssue - The country of issue for the identification.
     * @param {string} nationality - The nationality of the patient.
     * @param {string} race - The race of the patient.
     * @param {string} genders - The gender option for the dropdown in the form.
     * @param {string} countryCode - The country code for the mobile number.
     * @param {string} age - The age of the patient.
     * @param {string} nonMyKadInformation - Any non-MyKAD-specific information (used if the identification type is Passport or other MyKAD types).
     * @param {string} email - The email address of the patient.
     * @param {string} nicType - The type of NIC (used when identification type is 'MyKAD').
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table for dynamic data.
     * @param {number} wait - The waiting time (in milliseconds) for waiting for the elements to load.
     */

    static async bc_HandleFillPatientInfo(page: Page, identificationType: string, gender: string , countryofIssue: string, 
        nationality: string, race: string, genders: string, countryCode: string, nonMyKadInformation: string, 
        email: string, nicType: string, isNewBorn: boolean, needPatientRemark: boolean, addPatientRemark: string, 
        isAppointment: boolean,appoitnmentNicNo: string,appointmentId: string,appoitnmentPatientAge: string,
        appoitnmentMobileNo: string,appoitnmentEmail: string,patientName: string,isTwinFirst: boolean, isTwinSecond: boolean, columnPatientNIC: string, columnPatientDOB: string,
        columnPatientMobileNo: string,
        datatablename: string, index: number,  wait: number = 3000 , countryCodeNeedSelect: boolean = false) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_identificationtype',wait, 'soft');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_identificationtype');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_identificationtype');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', identificationType);
        if(isTwinFirst && isTwinSecond){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.check_ischecked_twinpatient',wait, 'soft');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.check_ischecked_twinpatient');
            await BaseCommandCaller.assertCheckboxState(page, 'PG_PatientRegistration.check_ischecked_twinpatient', true);
        }
        if(identificationType === 'MyKAD'){
            await LIB_PatientRegistration.bc_HandleMyKAD(page,isAppointment,patientName,appoitnmentNicNo,appointmentId,appoitnmentPatientAge,gender,countryofIssue, nationality,
                isTwinFirst, isTwinSecond, columnPatientNIC, columnPatientDOB,  datatablename,index, nicType, wait);
        }
        const validTypesPassprt = ['Passport', 'Passport (Father)', 'Passport (Mother)', 'Passport (Others)'];
        if (validTypesPassprt.includes(identificationType)) {
            await LIB_PatientRegistration.bc_HandlePassport(page, countryofIssue,nationality, nonMyKadInformation, datatablename,index,wait);
        }
        const validTypesMyKadOther = ['MyKAD (Father)', 'MyKAD (Mother)', 'MyKAD (Other)'];
        if (validTypesMyKadOther.includes(identificationType)) {
            await LIB_PatientRegistration.bc_HandleMyKADOthers(page, gender, countryofIssue, nationality,nicType,isNewBorn, datatablename, index, wait);
            
        }
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_race',wait, 'soft');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_race');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_race');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', race);
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_gender',wait, 'soft');
        await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_gender', genders);
        await BaseCommandCaller.hardPause(page,3000);
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_countrycode',wait, 'soft');
        if(countryCodeNeedSelect){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_countrycode');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_countrycode');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', countryCode);
        }
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_countrycode', countryCode);
       
        if(!isAppointment){
            if(!isTwinSecond){
            const patientMobileNo = await MobileNumberGenerator.generateAndUpdateJson('patientMobileNo', datatablename, index);
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mobileno');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mobileno', patientMobileNo);
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_email');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_email', email);
            }
            if(isTwinSecond){
                const updatedData = DataHelper.reloadData(datatablename);
                const updadtedPatientMobileNo = updatedData[index][columnPatientMobileNo];
                await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mobileno');
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mobileno', updadtedPatientMobileNo);
                await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_email');
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_email', email);
            }
        }
        if(isAppointment){
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_mobileno', appoitnmentMobileNo);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_email', appoitnmentEmail);
        }
        if(needPatientRemark){
            await LIB_PatientRegistration.bc_HandelAddPatientRemarkIsChecked(page,addPatientRemark);
        }
        
    }


    static async bc_HandelAddPatientRemarkIsChecked(page: Page, addPatientRemark: string,  wait: number = 3000 ) {
        
        const isCheckRemark = await BaseCommandCaller.getCheckboxState(page, 'PG_PatientRegistration.check_isaddpatientremark');
        if(isCheckRemark){
                await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.textarea_addpatientremark',wait, 'soft');
                await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.textarea_addpatientremark');
                await BaseCommandCaller.fill(page,'PG_PatientRegistration.textarea_addpatientremark', addPatientRemark);
        }
        if(!isCheckRemark){
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.check_isaddpatientremark');
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.textarea_addpatientremark',wait, 'soft');
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.textarea_addpatientremark');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.textarea_addpatientremark', addPatientRemark);
        }
    }
    /**
     * This function handles the process of filling out the Additional Patient Details section of the patient registration form.
     * It populates fields related to the patient's religion, marital status, occupation, address details (house number, office number, street, country, state, town, postcode),
     * and the country code for both the house and office numbers.
     * 
     * 1. **Initial Setup**:
     *    - The function ensures that the Additional Patient Details card (`card_additionaldetails`) is present on the page and clicks to expand it.
     * 
     * 2. **Filling Religion**:
     *    - It clears and fills the religion field (`input_religion`) by selecting the appropriate option from the dropdown list.
     * 
     * 3. **Filling Marital Status**:
     *    - It clears and fills the marital status field (`input_maritalstatus`) by selecting the appropriate option from the dropdown list.
     * 
     * 4. **Filling Occupation**:
     *    - It clears and fills the occupation field (`input_occupation`) with the provided `occupation` value.
     * 
     * 5. **Filling Address Details**:
     *    - The function first handles the country code for both the house number and office number by selecting the corresponding option (`input_addhousenocode` and `input_addofficenocode`).
     *    - It then generates and fills dynamic data for house number and office number fields (`input_addhouseno` and `input_addofficeno`).
     * 
     * 6. **Filling Street Address**:
     *    - The function fills the street address fields (`input_street1`, `input_street2`, `input_street3`, `input_street4`) with the provided address details.
     * 
     * 7. **Filling Country, State, Town, and Postcode**:
     *    - The function fills in the country, state, town, and postcode fields by selecting the appropriate options or entering the values for each field.
     * 
     * 8. **Dynamic Data Generation**:
     *    - The house number (`addhouseno`) and office number (`addofficeno`) are dynamically generated using the `MobileNumberGenerator` and then filled into the respective fields.
     * 
     * 9. **Error Handling**:
     *    - The function interacts with various form elements, performing assertions and ensuring the correct data is selected or filled into the form.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} religion - The patient's religion.
     * @param {string} maritalstatus - The patient's marital status.
     * @param {string} occupation - The patient's occupation.
     * @param {string} countryCode - The country code for the house and office numbers.
     * @param {string} street1 - The first line of the patient's street address.
     * @param {string} street2 - The second line of the patient's street address.
     * @param {string} street3 - The third line of the patient's street address.
     * @param {string} street4 - The fourth line of the patient's street address.
     * @param {string} country - The country of the patient's address.
     * @param {string} state - The state of the patient's address.
     * @param {string} town - The town of the patient's address.
     * @param {string} postcode - The postcode of the patient's address.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table for dynamic data.
     * @param {number} wait - The waiting time (in milliseconds) for waiting for the elements to load.
     */

    static async bc_HandleAditionalPatientDetails(page: Page,religion: string, maritalstatus: string, occupation: string, countryCode:string, 
        street1:string, street2:string, street3:string, street4:string, country: string, state: string, town: string, postcode: string, datatablename: string, index: number, wait: number = 3000, countryCodeNeedSelect: boolean = false) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_additionaldetails',wait, 'soft');
        await BaseCommandCaller.click(page,'PG_PatientRegistration.card_additionaldetails')
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_religion');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_religion');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', religion);

        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_maritalstatus');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_maritalstatus');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', maritalstatus);

        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_occupation');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_occupation', occupation);
        
        
        if(countryCodeNeedSelect){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_addhousenocode');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_addhousenocode');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', countryCode);
        }
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_addhousenocode', countryCode);

        const addhouseno = await MobileNumberGenerator.generateAndUpdateJson('addHouseNo', datatablename, index);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_addhouseno');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_addhouseno', addhouseno);
        
        
        if(countryCodeNeedSelect){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_addofficenocode');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_addofficenocode');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', countryCode);
        }
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_addofficenocode', countryCode);

        const addofficeno = await MobileNumberGenerator.generateAndUpdateJson('addOfficeNo', datatablename, index);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_addofficeno');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_addofficeno', addofficeno);

        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street1');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street1', street1);

        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street2');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street2', street2);

        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street3');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street3', street3);

        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street4');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street4', street4);

        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_country');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_country');
        await BaseCommandCaller.hardPause(page,1000);
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_country', country);
        await BaseCommandCaller.arrowDown(page,'PG_PatientRegistration.input_country');
        await BaseCommandCaller.enter(page,'PG_PatientRegistration.input_country');
        await BaseCommandCaller.hardPause(page,1000);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_states');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_states');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', state);
        await BaseCommandCaller.hardPause(page,1000);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_town');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_town');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', town);
        
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_additionalpatientdetails_postcode');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_additionalpatientdetails_postcode', postcode);
        
    }

    /**
     * This function handles the Visit Admission Details section of the patient registration form.
     * It selects the patient type and private category, handles the doctor selection process,
     * stores selected doctor information (specialty and name), and ensures the doctor checkbox is checked.
     * 
     * 1. **Initial Setup**:
     *    - The function ensures that the Admission Details card (`card_admissiondetails`) is present on the page and clicks on it to expand the section.
     * 
     * 2. **Selecting Patient Type and Private Category**:
     *    - It selects the patient type and private category from the respective dropdowns using the provided `patientType` and `privateCategory` values.
     * 
     * 3. **Handling Doctor Selection**:
     *    - The function clicks the button to add a new doctor (`button_addnewdoctor`).
     *    - It then invokes the `bc_HandleSelectDoctor` function to handle the doctor selection process (which is handled in a separate function).
     * 
     * 4. **Storing Doctor Information**:
     *    - After selecting the doctor, the function stores the selected doctor’s specialty (`doctorSpeciality`) and name (`doctor`) into the specified data table (`datatablename`) at the given index.
     * 
     * 5. **Doctor Checkbox Handling**:
     *    - It clicks the checkbox to confirm that the doctor is selected and asserts that the checkbox is checked (`true`).
     * 
     * 6. **Error Handling**:
     *    - The function interacts with various form elements and performs assertions to ensure the correct data is selected and stored.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} patientType - The type of the patient (e.g., 'Inpatient', 'Outpatient').
     * @param {string} privateCategory - The private category of the patient (e.g., 'Private', 'Public').
     * @param {string} datatablename - The name of the data table used to store the selected doctor information.
     * @param {number} index - The index in the data table where the doctor information is stored.
     * @param {number} wait - The waiting time (in milliseconds) for waiting for the elements to load.
     */

    static async bc_HandleVisitAdmissionDetails(page: Page, isAppoitnment: boolean, patientType: string, privateCategory: string, isPrivilege: boolean, privilageType: string, privilageRemark: string,corporateName: string, creditLimitExceed: string, creditBalanceLimit: string, corporateAmount: string, 
        coGuarantor: string, isReferredByClinic: boolean,clinicName: string, datatablename: string, index: number, wait: number) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_admissiondetails',wait, 'soft');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.card_admissiondetails');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_patienttype',wait, 'soft');
        await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_patienttype', patientType);
        if(patientType === 'Corporate'){
            await LIB_PatientRegistration.bc_HandleCorporateDetails(page,corporateName,creditLimitExceed,creditBalanceLimit,corporateAmount,coGuarantor,datatablename,index,wait);
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_savecorporate');
            const coporateName = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_disabled_displaycorporatename');
            console.log(coporateName);
        }
        await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_privatcategory', privateCategory);
        
        if(!isAppoitnment){
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_addnewdoctor');
        await LIB_PatientRegistration.bc_HandleSelectDoctor(page,wait);
        }
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_doctorspecialist', datatablename,'doctorSpeciality', index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_doctor', datatablename,'doctor', index);
        await BaseCommandCaller.click(page,'PG_PatientRegistration.check_isdoctorchecked');
        await BaseCommandCaller.assertCheckboxState(page,'PG_PatientRegistration.check_isdoctorchecked',true);
        if(isPrivilege === true){
            await LIB_PatientRegistration.bc_HandlePrivilege(page,privilageType,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditVisitAdmissionDetailsPrivilegeAddRemark(page,privilageRemark,datatablename,index);
        }
        if(isReferredByClinic === true){
            const updatedData = DataHelper.reloadData(datatablename);
            const updadtedDoctore = updatedData[index].doctor;
            await LIB_PatientRegistration.bc_HandleReferbyExternalClinic(page,clinicName,updadtedDoctore,datatablename,index);
        }
        

    }
    /**
     * This function handles the process of filling out the emergency contact details in the patient registration form.
     * It populates various fields related to the emergency contact, including the contact person's name, gender, 
     * relation type, and address details. The function also handles cases where the emergency contact's address 
     * is the same as the patient's address, and it generates dynamic data for the contact's mobile number.
     * 
     * 1. **Initial Setup**:
     *    - The function checks if the Emergency Contact Details section (`card_emergencycontactdetails`) is present on the page, 
     *      and then clicks to expand the section.
     * 
     * 2. **Filling Emergency Contact Details**:
     *    - It generates and fills in the emergency contact person’s name (`contactPersonName`) using a name generator function.
     *    - The function then selects the gender and relation type for the emergency contact from the dropdowns.
     * 
     * 3. **Handling Address Details**:
     *    - If the emergency contact’s address is the same as the patient's address (`isSamePatientAddress == true`), 
     *      it selects the checkbox indicating this and verifies the checkbox state.
     *    - If the emergency contact’s address is different from the patient's address, it fills in the relevant address fields 
     *      such as street address, country, state, city, and postcode.
     * 
     * 4. **Filling Mobile Number**:
     *    - The function selects the country code for the mobile number and generates a random mobile number for the emergency contact.
     *    - It then fills in the mobile number for the emergency contact.
     * 
     * 5. **Error Handling**:
     *    - The function interacts with various form elements using selectors and fills them with values from the data table or dynamically generated values.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} genderEmergencyContact - The gender of the emergency contact (e.g., 'Male', 'Female').
     * @param {string} relationType - The relationship type of the emergency contact (e.g., 'Mother', 'Father').
     * @param {boolean} isSamePatientAddress - A flag indicating if the emergency contact shares the same address as the patient.
     * @param {string} street1Relation - The street address line 1 of the emergency contact.
     * @param {string} street2Relation - The street address line 2 of the emergency contact.
     * @param {string} street3Relation - The street address line 3 of the emergency contact.
     * @param {string} street4Relation - The street address line 4 of the emergency contact.
     * @param {string} countryRelation - The country of the emergency contact.
     * @param {string} stateRelation - The state of the emergency contact.
     * @param {string} townRelation - The town/city of the emergency contact.
     * @param {string} postcodeRelation - The postcode of the emergency contact.
     * @param {string} relationCountryCode - The country code for the emergency contact’s mobile number.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table to verify and fill.
     * @param {number} wait - The waiting time (in milliseconds) for waiting for the elements to load.
     */

    static async bc_HandleEmergencyContactDetails(page: Page, genderEmergencyContact: string, relationType: string, isSamePatientAddress: boolean, street1Relation: string,
        street2Relation: string, street3Relation: string, street4Relation: string, countryRelation: string, stateRelation: string, townRelation: string, 
        postcodeRelation: string, relationCountryCode: string, datatablename: string, index: number, wait: number = 3000, countryCodeNeedSelect: boolean = false) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_emergencycontactdetails',wait, 'soft');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.card_emergencycontactdetails');
        const emergencyContactPersonName = await NameGenerator.generateAndUpdateJson('contactPersonName',datatablename,index);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_contactpersonname');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_contactpersonname', emergencyContactPersonName);
        await BaseCommandCaller.selectOption(page, 'PG_PatientRegistration.select_gender_emergencycontactdetails', genderEmergencyContact ); 
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_relationtype');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_relationtype');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', relationType);


        if(isSamePatientAddress ==  true){
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.check_sameaspatientaddress');
            await BaseCommandCaller.assertCheckboxState(page, 'PG_PatientRegistration.check_sameaspatientaddress', true);
        }
        else{
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_street1_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street1_relationtype', street1Relation);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_street2_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street2_relationtype', street2Relation);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_street3_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street3_relationtype', street3Relation);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_street4_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street4_relationtype', street4Relation);
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_country_relationtype');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_country_relationtype');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', countryRelation);
            
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_state_relationtype');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_state_relationtype');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', stateRelation);
            
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_city_relationtype');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_city_relationtype');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', townRelation);
            
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_postcode_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_postcode_relationtype', postcodeRelation);
        }
        
        if(countryCodeNeedSelect){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_countrycodemobile_relationtype');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_countrycodemobile_relationtype');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', relationCountryCode);
        }
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_addofficenocode', relationCountryCode);
        const relationMobileNumber = await MobileNumberGenerator.generateAndUpdateJson('relationMobileNumber', datatablename, index);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_mobileno_relationtype');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mobileno_relationtype', relationMobileNumber);

    }

    /**
     * This function handles the process of clicking the Register button in the patient registration form.
     * It first ensures that the Register button is present on the page, clicks it, and then confirms the registration
     * by clicking the "OK" button once it appears.
     * 
     * 1. **Check and Click Register Button**:
     *    - The function checks for the presence of the Register button (`button_register`) on the page.
     *    - Once the Register button is located, it clicks on it to initiate the registration process.
     * 
     * 2. **Wait for Confirmation**:
     *    - After clicking the Register button, the function waits for the confirmation button (`button_ok`) to appear.
     * 
     * 3. **Click OK Button**:
     *    - Once the OK button becomes available, the function clicks it to confirm the registration process.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {number} [wait=3000] - The waiting time (in milliseconds) for waiting for the buttons to be loaded (default is 3000 milliseconds).
     */


    static async bc_HandleClickonRegisterButton(page: Page, isNewBorn: boolean, wait: number = 3000) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.button_register',wait, 'soft');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_register');
        await BaseCommandCaller.hardPause(page,wait);
        if(isNewBorn){
            await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.button_nodatechangenewborn',wait, 'hard');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_nodatechangenewborn');
        }
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.button_ok',wait, 'hard');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_ok');
        
    }

    /**
     * This function handles the process of selecting a doctor from the available list in the patient registration form.
     * It interacts with the form elements to check if the doctor checkbox is present, selects a doctor from a list, 
     * and performs the necessary actions based on the availability of the doctor.
     * 
     * 1. **Check if Doctor Checkbox is Present**:
     *    - The function first checks whether the checkbox indicating the doctor’s availability (`check_isdoctorchecked`) is present on the page.
     * 
     * 2. **Selecting the Doctor**:
     *    - It clicks the input field to select the doctor (`input_doctor`).
     *    - It waits for the list of available doctors (`list_matoptions`) to be visible.
     * 
     * 3. **Iterating and Selecting Doctor**:
     *    - The function iterates over the options in the list of available doctors and selects one.
     *    - If the doctor is available, it interacts with the form elements accordingly, such as filling in the doctor's specialty and name fields.
     *    - If the doctor is unavailable, it clicks the appropriate button to confirm the unavailability.
     * 
     * 4. **Wait for Completion**:
     *    - The function waits for up to 10 seconds (`10000` milliseconds) to ensure the doctor selection is completed.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {number} [wait=10000] - The waiting time (in milliseconds) to wait for the doctor checkbox and input field to be present (default is 3000 milliseconds).
     */

    static async bc_HandleSelectDoctor(page: Page, wait: number = 10000) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.check_isdoctorchecked',wait, 'soft');
        await BaseCommandCaller.click(page,'PG_PatientRegistration.input_doctor');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_Common.list_matoptions');
        await BaseCommandCaller.iterateAndSelectOption(page,'PG_Common.list_matoptions', 'PG_PatientRegistration.label_doctoravailable', 'PG_PatientRegistration.button_doctorunavailableok','PG_PatientRegistration.input_doctorspecialist','PG_PatientRegistration.input_doctor','PG_PatientRegistration.input_doctor',wait);
        
    }
    /**
     * This function handles the storing of MRN (Medical Registration Number) and Visit Number (VisitNo) from the patient registration form
     * into a JSON file for later use. It also verifies that the patient name in the form matches the updated data from the provided 
     * data table at the specified index.
     * 
     * 1. **Initial Setup**:
     *    - The function waits for the specified timeout (`wait`), ensuring the page has loaded properly.
     *    - It ensures that the MRN input field (`input_mrn_basicregistrationinfo`) is present and waits for it to be available.
     * 
     * 2. **Storing Data**:
     *    - It stores the MRN (`input_mrn_basicregistrationinfo`) and Visit Number (`input_disabled_visitno`) values from the form 
     *      into a JSON file, using the provided `datatablename` and `index` to store data at the appropriate position in the file.
     * 
     * 3. **Verifying Patient Name**:
     *    - The function reloads the data from the data table and retrieves the updated patient name.
     *    - It logs the updated patient name for verification purposes and asserts that the patient name in the form matches the 
     *      value retrieved from the data table.
     * 
     * 4. **Error Handling**:
     *    - If the values stored in the form do not match the expected values (e.g., patient name), the function will raise an error due 
     *      to the failed assertions.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table for storing/retrieving data.
     * @param {number} [wait=10000] - The waiting time (in milliseconds) for waiting for the elements to load (default is 10 seconds).
     */

    static async bc_HandleStoreMrnandVisitNo(page: Page, datatablename: string, index: number, wait: number = 10000) {

        await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo',wait, 'hard');
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_mrn_basicregistrationinfo', datatablename,'mrnNo', index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_disabled_visitno', datatablename,'visitNo', index);
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientName = updatedData[index].patientName;
        console.log(`Updated doctor name: ${updadtedPatientName}`);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_patientname', updadtedPatientName);

    }

    static async bc_HandlePrivilege(page: Page, previleageType: string, wait: number = 3000) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_previleage',wait, 'hard');
        await BaseCommandCaller.selectOption(page, 'PG_PatientRegistration.select_previleage', previleageType);
        
    }


    static async bc_HandleDeathDetails(page: Page, causeofDeath: string, datatablename: string, index: number, wait: number = 3000) {

        const isChecked = await BaseCommandCaller.getCheckboxState(page,'PG_PatientRegistration.check_isPatientdeceased');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_previleage',wait, 'hard');
        if(isChecked === false){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.check_isPatientdeceased');
            const todayDate = await BaseCommandCaller.generateFormattedDate();
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_datetimeofdeath', todayDate);
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_causeofdeath', causeofDeath);
            
        }
        if(isChecked === true){
            
            const todayDate = await BaseCommandCaller.generateFormattedDate();
            const deathDateTime = await BaseCommandCaller.getInputDataAndStoreInJson(page, 'PG_PatientRegistration.input_datetimeofdeath', datatablename, 'deathDateTime', index);
            if(deathDateTime === 'null'){
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_datetimeofdeath', todayDate);
                await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_causeofdeath');
                await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_causeofdeath', causeofDeath);  
            
            }
            
        }
        
        
    }


    static async bc_HandleBlackListing(page: Page, blacklistReason: string, datatablename: string, index: number, wait: number = 3000) {

        const isChecked = await BaseCommandCaller.getCheckboxState(page,'PG_PatientRegistration.check_ischeckedblacklisted');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_previleage',wait, 'hard');
        if(isChecked === false){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.check_ischeckedblacklisted');
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_blacklistreason');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_blacklistreason', blacklistReason);
            
        }
        if(isChecked === true){
            
            const blacklistReason = await BaseCommandCaller.getInputDataAndStoreInJson(page, 'PG_PatientRegistration.input_blacklistreason', datatablename, 'blacklistReason', index);
            if(blacklistReason === 'null'){
                await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_blacklistreason');
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_blacklistreason', blacklistReason);
            
            }
            
        }
        
        
    }

    static async bc_HandleReferbyExternalClinic(page: Page, clinicName: string, clinicReferTo: string, datatablename: string, index: number, wait: number = 10000) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.link_referdbyexternaldoctor',wait, 'hard');
        await BaseCommandCaller.click(page,'PG_PatientRegistration.link_referdbyexternaldoctor');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_cliniccode',wait, 'hard');
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_clinicname');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_clinicname', clinicName);
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', clinicName);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_cliniccode',datatablename,'clinicCode',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_clinicStreet',datatablename,'clinicStreet',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_cliniccountry',datatablename,'clinicCountry',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_clinicstatecode',datatablename,'clinicState',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_cliniccitycode',datatablename,'clinicCity',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_clinicpostcode',datatablename,'clinicPostCode',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_clinicofficeno',datatablename,'clinicOfficeNo',index);
        const referBy = await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_referby',datatablename,'clinicReferBy',index);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_referto');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_referto', clinicReferTo);
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', clinicReferTo);
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_clinicsave');
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_referbyexternaldoctor', referBy ?? '', true);

    }


    static async bc_HandleCorporateDetails(page: Page, corporateName: string, creditLimitExceed: string, creditBalanceLimit: string,
        corporateAmount: string, coGuarantor: string, datatablename: string, index: number, wait: number = 10000) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_corporatename',wait, 'hard');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_corporatename');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_corporatename', ' ');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_corporatename');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', corporateName);
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_corporatecode',wait, 'hard')
        await BaseCommandCaller.storeDataFromLocatorToJson(page, 'PG_PatientRegistration.input_corporatecode',datatablename, 'corporateCode', index)
        await BaseCommandCaller.storeDataFromLocatorToJson(page, 'PG_PatientRegistration.textarea_corporateaddress',datatablename, 'corporateAddress', index)
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_creditlimitexceed', creditLimitExceed);
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_creditbalancelimit', creditBalanceLimit);
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_corporateammount', corporateAmount);
        const corporateStafReferenceNo = await BaseCommandCaller.generateRandomNumber();
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_corporaterefstaffno', corporateStafReferenceNo);
        await BaseCommandCaller.getInputDataAndStoreInJson(page, 'PG_PatientRegistration.input_corporaterefstaffno',datatablename, 'refStafNo', index);
        if(coGuarantor === ''){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_corguarantor');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_corguarantor');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.input_referto', coGuarantor);

        }

        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_addrowguaranteeletter');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_glno',wait, 'hard');
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_glno');
        const glno = await BaseCommandCaller.generateRandomNumber();
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_glno', glno);
        await BaseCommandCaller.click(page,'PG_PatientRegistration.check_glapply');

    }

    /**
     * This function verifies the registration details in the Patient Information section of the patient registration form.
     * It checks various fields related to the patient's personal details such as name, identification type, race, gender, date of birth, 
     * age, passport number, mobile number, and email. The function compares the form data with the values from the provided data table 
     * at the specified index and asserts that they match. It also handles different identification types, including MyKAD and Passport.
     * 
     * 1. **Initial Setup**:
     *    - The function ensures that the Patient Information section is present on the page (`input_patientname`).
     *    - It reloads the data from the provided data table (`datatablename`) and retrieves values for patient name, identification type, 
     *      patient NIC, race, gender, date of birth (DOB), age, passport number, mobile number, email, and guardian NIC for verification.
     * 
     * 2. **Verifying Patient Details**:
     *    - The function verifies the patient's name, identification type, and NIC against the form values.
     *    - For MyKAD identification type, it asserts the NIC field, and for passport types, it checks the passport number and expiry date.
     * 
     * 3. **Verification Based on Identification Type**:
     *    - If the identification type is a Passport (including various categories like `Passport`, `Passport (Father)`, etc.), the function 
     *      asserts the passport number and expiry date.
     *    - If the identification type is a MyKAD variant (such as `MyKAD (Father)`, `MyKAD (Mother)`, etc.), it asserts the guardian NIC.
     * 
     * 4. **Verifying Other Patient Information**:
     *    - The function checks the race, gender, mobile number, and email, ensuring they match the expected values.
     * 
     * 5. **Error Handling**:
     *    - If the values in the form do not match the expected values, the function will raise an error due to failed assertions.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table to verify.
     * @param {number} [wait=10000] - The waiting time (in milliseconds) for waiting for the elements to load (default is 10 seconds).
     */

        static async bc_VerifyRegistrationDetailsinPatientInfo(
            page: Page,
            datatablename: string,
            index: number,
            wait: number = 10000
        ) {
            // Wait for the locator to be present
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_patientname', wait, 'hard');
        
            // Reload data and destructure the required fields
            const updatedData = DataHelper.reloadData(datatablename);
            const {
                patientName,
                identificationType,
                patientNic,
                race,
                genders,
                DOB,
                age,
                expieryDate,
                passportNumber,
                patientMobileNo,
                email,
                patientGurdianNic,
            } = updatedData[index];
        
            // Helper function to assert input data
            const assertInputData = async (locator: string, value: string) => {
                await BaseCommandCaller.getInputDataAndAssert(page, locator, value);
            };
        
            // General assertions
            await assertInputData('PG_PatientRegistration.input_patientname', patientName);
            await assertInputData('PG_PatientRegistration.input_identificationtype', identificationType);
        
            // Conditional checks for identification type
            if (identificationType === 'MyKAD') {
                await assertInputData('PG_PatientRegistration.input_ic_no', patientNic);
            }
        
            const validTypesPassport = ['Passport', 'Passport (Father)', 'Passport (Mother)', 'Passport (Others)'];
            if (validTypesPassport.includes(identificationType)) {
                await assertInputData('PG_PatientRegistration.input_oldic_passport', passportNumber);
                await assertInputData('PG_PatientRegistration.input_passportexpiery', expieryDate);
                await assertInputData('PG_PatientRegistration.input_dob', DOB);
                await assertInputData('PG_PatientRegistration.input_age', age);
            }
        
            const validTypesMyKadOther = ['MyKAD (Father)', 'MyKAD (Mother)', 'MyKAD (Other)'];
            if (validTypesMyKadOther.includes(identificationType)) {
                await assertInputData('PG_PatientRegistration.input_oldic_passport', patientGurdianNic);
                await assertInputData('PG_PatientRegistration.input_dob', DOB);
                await assertInputData('PG_PatientRegistration.input_age', age);
            }
        
            // Additional assertions
            await assertInputData('PG_PatientRegistration.input_race', race);
            await BaseCommandCaller.assertSelectedOption(page, 'PG_PatientRegistration.select_gender', genders);
            await assertInputData('PG_PatientRegistration.input_mobileno', patientMobileNo);
            await assertInputData('PG_PatientRegistration.input_email', email);
        }
        
    /**
     * This function verifies the registration details in the Additional Patient Details section of the patient registration form.
     * It checks various fields related to the patient's religion, marital status, occupation, address, and contact details.
     * The function compares the form data with the values from the provided data table at the specified index and asserts that they match.
     * 
     * 1. **Initial Setup**:
     *    - The function ensures that the Additional Patient Details section (`card_additionaldetails`) is present on the page.
     *    - It reloads the data from the provided data table (`datatablename`) and retrieves the values for religion, marital status, 
     *      occupation, and address details (house number, office number, street, country, state, town, postcode) from the row at the given index.
     * 
     * 2. **Verifying Patient Details**:
     *    - The function verifies that the patient's religion, marital status, and occupation match the values retrieved from the data table.
     * 
     * 3. **Verifying Address and Contact Information**:
     *    - It verifies the patient's address fields such as house number, office number, street addresses (1-4), country, state, town, and postcode.
     * 
     * 4. **Error Handling**:
     *    - If the values in the form do not match the expected values, the function will raise an error due to the failed assertions.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table to verify.
     * @param {number} [wait=10000] - The waiting time (in milliseconds) for waiting for the elements to load (default is 10 seconds).
     */

    static async bc_VerifyRegistrationDetailsinAdditionalPatientDetails(page: Page,needPatientRemark: boolean,addPatientRemark: string, datatablename: string, index: number, wait: number = 10000) {

     
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_additionaldetails',wait, 'hard');
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedReligion = updatedData[index].religion;
        const updadtedMaritalstatus = updatedData[index].maritalstatus;
        const updadtedOccupation= updatedData[index].occupation;
        const updadtedAddHouseNo = updatedData[index].addHouseNo;
        const updadtedAddOfficeNo = updatedData[index].addOfficeNo;
        const updadtedStreet1 = updatedData[index].street1;
        const updadtedStreet2 = updatedData[index].street2;
        const updadtedStreet3 = updatedData[index].street3;
        const updadtedStreet4 = updatedData[index].street4;
        const updadtedcountryAditionalInfo = updatedData[index].countryAditionalInfo;
        const updadtedState = updatedData[index].state;
        const updadtedTown = updatedData[index].town;
        const updadtedPostalCode = updatedData[index].postalCode;
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_religion', updadtedReligion);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_maritalstatus', updadtedMaritalstatus);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_occupation', updadtedOccupation);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_addhouseno', updadtedAddHouseNo);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_addofficeno', updadtedAddOfficeNo);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_street1', updadtedStreet1);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_street2', updadtedStreet2);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_street3', updadtedStreet3);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_street4', updadtedStreet4);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_country', updadtedcountryAditionalInfo);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_states', updadtedState);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_town', updadtedTown);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_additionalpatientdetails_postcode', updadtedPostalCode);
        if(needPatientRemark){
            await BaseCommandCaller.assertCheckboxState(page, 'PG_PatientRegistration.check_isaddpatientremark',true);
            await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.textarea_addpatientremark', addPatientRemark);

        }


    }

    /**
     * This function verifies the registration details in the Visit Admission section of the patient registration form.
     * It checks the fields related to the patient's type, private category, doctor speciality, and doctor details, 
     * and asserts that they match the values provided in the data table at the specified index.
     * 
     * 1. **Initial Setup**:
     *    - The function ensures the presence of the Visit Admission section (`card_admissiondetails`) on the page.
     *    - It reloads the data from the provided data table (`datatablename`) and retrieves the values for patient type, 
     *      private category, doctor speciality, and doctor from the row at the given index.
     * 
     * 2. **Verifying Patient Type**:
     *    - The function asserts that the patient type in the form matches the value retrieved from the data table (`patientType`).
     * 
     * 3. **Verifying Private Category**:
     *    - The function asserts that the private category in the form matches the value retrieved from the data table (`privateCategory`).
     * 
     * 4. **Verifying Doctor Speciality**:
     *    - The function retrieves the doctor speciality from the data table and asserts that it matches the value in the form.
     * 
     * 5. **Verifying Doctor**:
     *    - The function retrieves the doctor information from the data table and asserts that it matches the value in the form.
     * 
     * 6. **Error Handling**:
     *    - If the values in the form do not match the expected values, the function will raise an error due to the failed assertions.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} datatablename - The name of the data table used to retrieve dynamic data.
     * @param {number} index - The index of the record in the data table to verify.
     * @param {number} [wait=10000] - The waiting time (in milliseconds) for waiting for the elements to load (default is 10 seconds).
     */

    static async bc_VerifyRegistrationDetailsinVisitAdmission (page: Page,isPrivilege: boolean, privilageType: string, privilageRemark: string, datatablename: string, index: number, wait: number = 10000) {

     
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_admissiondetails',wait, 'hard');
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientType = updatedData[index].patientType;
        const updadtedPrivateCategory = updatedData[index].privateCategory;
        const updadtedDoctorSpeciality = updatedData[index].doctorSpeciality;
        const updadtedDoctor = updatedData[index].doctor;
        await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_patienttype', updadtedPatientType);
        await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_privatcategory', updadtedPrivateCategory);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_doctorspecialist', updadtedDoctorSpeciality);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_doctor', updadtedDoctor);
        if(isPrivilege){
            await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_previleage', privilageType);
            await BaseCommandCaller.assertCheckboxState(page,'PG_PatientRegistration.check_isaddremarkchecked', true);
            await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.textarea_addremark', privilageRemark);
        }

    }


    /**
     * This function verifies the registration details in the emergency contact section of the patient registration form.
     * It checks various fields related to both the contact person and the address (either the patient's or the emergency contact's), 
     * and performs assertions to ensure the correct data is populated. The function also handles different cases where the patient 
     * and emergency contact share the same address or have separate addresses.
     * 
     * 1. **Initial Setup**:
     *    - The function logs the start of the process and the parameters passed to it (`isSamePatientAddress`, `datatablename`, `index`).
     *    - It reloads the data from the given data table and ensures that valid data is available at the provided index.
     * 
     * 2. **Verifying Basic Contact Details**:
     *    - It verifies that the contact person’s details (name, relation type, gender) match the expected values.
     * 
     * 3. **Verifying Address Details**:
     *    - If the patient and emergency contact share the same address (`isSamePatientAddress` is `true`), it verifies the patient's address fields (street, country, state, town, postcode).
     *    - If the patient and emergency contact have separate addresses (`isSamePatientAddress` is `false`), it verifies the emergency contact’s address fields.
     * 
     * 4. **Verifying Emergency Contact Phone Details**:
     *    - It verifies the emergency contact’s phone details (country code and mobile number).
     * 
     * 5. **Error Handling**:
     *    - If any required data is missing or invalid, an error will be thrown to indicate an issue with the data at the specified index.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {boolean} isSamePatientAddress - A flag indicating whether the patient and emergency contact share the same address.
     * @param {string} datatablename - The name of the data table used for dynamic data.
     * @param {number} index - The index of the record in the data table to verify.
     * @param {number} [wait=10000] - The waiting time (in milliseconds) for waiting for the elements to load (default is 10 seconds).
     */

    static async bc_VerifyRegistrationDetailsinEmergencyContact(
        page: Page,
        isSamePatientAddress: boolean,
        datatablename: string,
        index: number,
        wait: number = 10000
    ) {
        console.log('Starting bc_VerifyRegistrationDetailsinEmergencyContact');
        console.log(`isSamePatientAddress: ${isSamePatientAddress}, datatablename: ${datatablename}, index: ${index}`);
    
        // Ensure data table is valid
        const updatedData = DataHelper.reloadData(datatablename);
        if (!updatedData || !updatedData[index]) {
            throw new Error(`Invalid or missing data at index ${index} in table ${datatablename}`);
        }
    
        const {
            contactPersonName,
            genderEmergencyContact,
            relationType,
            street1Relation,
            street2Relation,
            street3Relation,
            street4Relation,
            countryRelation,
            stateRelation,
            townRelation,
            postcodeRelation,
            relationCountryCode,
            relationMobileNumber,
            street1,
            street2,
            street3,
            street4,
            countryAditionalInfo,
            state,
            town,
            postalCode,
        } = updatedData[index];
    
        console.log('Loaded updated data:', updatedData[index]);
    
        // Ensure locator is present
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_admissiondetails', wait, 'hard');
        await BaseCommandCaller.hardPause(page,10000);
        // Basic field assertions
        console.log('Verifying contact person details...');
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_contactpersonname', contactPersonName);
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_relationtype', relationType);
        await BaseCommandCaller.assertSelectedOption(page, 'PG_PatientRegistration.select_gender_emergencycontactdetails', genderEmergencyContact);
    
        if (isSamePatientAddress) {
            console.log('Verifying patient address fields...');
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street1', street1);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street2', street2);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street3', street3);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street4', street4);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_country', countryAditionalInfo);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_states', state);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_town', town);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_additionalpatientdetails_postcode', postalCode);
        } else {
            console.log('Verifying emergency contact address fields...');
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street1_relationtype', street1Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street2_relationtype', street2Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street3_relationtype', street3Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street4_relationtype', street4Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_country_relationtype', countryRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_state_relationtype', stateRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_city_relationtype', townRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_postcode_relationtype', postcodeRelation);
        }
    
        // Common emergency contact details
        console.log('Verifying emergency contact phone details...');
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_countrycodemobile_relationtype', relationCountryCode);
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_mobileno_relationtype', relationMobileNumber);
    
        console.log('Completed bc_VerifyRegistrationDetailsinEmergencyContact');
    }

    /**
     * This function handles the Medico Legal Case (MLC) registration process in the patient registration form.
     * It performs the following actions:
     * 
     * 1. **Check and Expand MLC Section**: 
     *    - Checks if the MLC section is collapsed. If it is, the function expands it by clicking the appropriate button.
     *    - If the section is already expanded, it waits for the section to be fully loaded.
     * 
     * 2. **Fill MLC Details**: 
     *    - Clears and fills the MLC number field with the provided `mlcNo`.
     *    - Selects the MLC type and mode of arrival from the dropdowns using `mlcType` and `modeofArival` values.
     * 
     * 3. **Fill MRN in MLC**: 
     *    - If the `mlcMrn` is not 'null', it clears and fills the MRN field (`mlcMrn`) in the MLC section.
     * 
     * 4. **Fill MLC Name**: 
     *    - Clears and fills the MLC name field using a name generated dynamically using the `NameGenerator` function, which retrieves the name from the data table.
     * 
     * 5. **Fill Country Code**: 
     *    - Clears and fills the country code field by clicking on it and selecting the appropriate option (`mlcCountryCode`).
     * 
     * 6. **Fill MLC Contact Number**: 
     *    - Generates and fills the contact number for the MLC using the `MobileNumberGenerator`, and updates it dynamically based on the data table.
     * 
     * 7. **Fill Remarks**: 
     *    - Clears and fills the remarks field with the provided `mlcRemark`.
     * 
     * This function assumes the presence of various helpers like `NameGenerator` and `MobileNumberGenerator`, and interacts with the page elements using Playwright's `BaseCommandCaller` for filling inputs and selecting options.
     * 
     * @param {Page} page - The Playwright Page object used to interact with the webpage.
     * @param {string} mlcNo - The Medico Legal Case number.
     * @param {string} mlcType - The type of Medico Legal Case.
     * @param {string} modeofArival - The mode of arrival for the case.
     * @param {string} mlcMrn - The MRN associated with the Medico Legal Case.
     * @param {string} mlcCountryCode - The country code associated with the Medico Legal Case.
     * @param {string} mlcRemark - Remarks related to the Medico Legal Case.
     * @param {string} datatablename - The name of the data table used for dynamic data.
     * @param {number} index - The index of the record in the data table.
     * @param {number} wait - The wait time (in milliseconds) for waiting for the elements to be loaded.
     */

    static async bc_HandleMedicoLeagalCase (page: Page, mlcNo: string, mlcType: string, modeofArival: string, mlcMrn: string, mlcCountryCode: string, mlcRemark: string, datatablename: string, index: number, wait: number = 10000, countryCodeNeedSelect: boolean = false) {

     
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_mlc',wait, 'hard');
        const isCollaps = await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_collapsemlc',wait, 'soft');
        if(isCollaps){
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.card_mlc');
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_expandmlc',wait, 'hard');

        }else{
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_expandmlc',wait, 'hard');
        }
       await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mlcno');
       await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mlcno', mlcNo);
       await BaseCommandCaller.selectOption(page, 'PG_PatientRegistration.select_mlctype', mlcType);
       await BaseCommandCaller.selectOption(page, 'PG_PatientRegistration.select_modofarival', modeofArival);
       if(!mlcMrn || mlcMrn === '' || mlcMrn === 'null'){
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mrninmlc');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mrninmlc', mlcMrn);
       }
       if(mlcMrn || mlcMrn === '' || mlcMrn === 'null'){
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mlcname');
        const mlcName = await NameGenerator.generateAndUpdateJson('mlcName', datatablename, index)
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mlcname', mlcName, true);
        
        if(countryCodeNeedSelect){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mlccountrycode');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_mlccountrycode');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', mlcCountryCode);
        }
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_addofficenocode', mlcCountryCode);
        const mlcContactNo = await MobileNumberGenerator.generateAndUpdateJson('mlcContactNo',datatablename,index);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mlccontactno');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mlccontactno', mlcContactNo, true);
       
       }
       await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.textarea_mlcremark');
       await BaseCommandCaller.fill(page, 'PG_PatientRegistration.textarea_mlcremark', mlcRemark, true);


    }
    

    /**
     * This function handles the MRN search process without a visit number.
     * It fills the MRN field with the provided value, checks if the `VisitNo` is valid, 
     * and continues the process in a loop until a valid `VisitNo` is found (either `null`, 
     * or one of the values "V", "A", or "OTC"). Additionally, it checks if the `identificationType` 
     * matches the provided input (`inputIdentificationType`), and breaks the loop if both conditions are met.
     * 
     * @param {Page} page - The Playwright Page object to interact with the webpage.
     * @param {number} wait - The waiting time (in milliseconds) for element actions.
     * @param {string} inputIdentificationType - The identification type to check against (e.g., "MyKAD", "Passport", "Other").
     */
    static async bc_HandleMrnSearchWithoutVisitNumber(page: Page,mrnInputManually: boolean, patientMrn: string, inputIdentificationType: string, wait: number = 8000) {
        let VisitNo: string | null;
        let identificationType: string | null; // Allowing identificationType to be either string or null
        if(mrnInputManually){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo', wait, 'soft');
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo', patientMrn);
            await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo');
        }
        else{
            while (true) {
                
                const randomNumber = await BaseCommandCaller.generateRandomNumber();
                // Step 1: Perform actions to fill the MRN field
                await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo', wait, 'soft');
                await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo');
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo', randomNumber);
                await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_mrn_basicregistrationinfo');
                await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
                // Step 2: Fetch VisitNo
                VisitNo = await BaseCommandCaller.getInputData(page, 'PG_PatientRegistration.input_disabled_visitno');
                console.log(VisitNo);
                console.log(VisitNo);
                console.log(`Fetched identification type: ${VisitNo}`);
                // Step 3: Fetch identification type
                identificationType = await BaseCommandCaller.getInputData(page, 'PG_PatientRegistration.input_identificationtype');
                console.log(`Fetched identification type: ${identificationType}`);

                // Step 4: Check if VisitNo is invalid (null or invalid values like "V", "A", "OTC")
                const invalidValues = ["V", "A", "OTC"];

                // Check if VisitNo is invalid
                if (VisitNo === null || invalidValues.some(value => VisitNo && VisitNo.split('/').includes(value))) {
                    // If VisitNo is invalid, check if identificationType matches the provided input
                    if (identificationType === inputIdentificationType) {
                        console.log(`VisitNo is invalid (${VisitNo}) and identification type matches input value (${inputIdentificationType}). Breaking the loop.`);
                        break;  // Exit the loop if both conditions are met
                    }
                } else {
                    // If VisitNo is valid (not null or not "V", "A", "OTC")
                    console.log('Valid VisitNo found:', VisitNo);
                    break;  // Exit the loop if VisitNo is valid
                }

                // If neither condition is met, clear the form and retry
                console.log('Retrying the process due to invalid VisitNo and unmatched identificationType.');

                // Step 5: Perform actions to clear the form and retry
                await LIB_PatientRegistration.bc_HandClearDataNav(page, wait);

                // Optional: Delay before the next iteration
                await BaseCommandCaller.hardPause(page,1000);  // Delay in milliseconds (e.g., 1 second)
            }

            console.log('Final VisitNo:', VisitNo);
            // Perform any necessary actions after the loop exits
            console.log('MRN search without visit number handled successfully.');
        }
    }

    static async bc_HandClearDataNav(page: Page, wait: number = 3000) {
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.button_clearTopNav', wait, 'soft');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_clearTopNav');
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.button_okclear', wait, 'soft');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_okclear');
    }

    static async bc_HandleStoreExistingPatientInfo(page: Page, datatablename: string, index: number) {

        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_mrn_basicregistrationinfo',datatablename,'patientMrn',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_patientname',datatablename,'patientName',index);
        const identificationType = await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_identificationtype',datatablename,'identificationType',index);
        console.log(`**********************`);
        console.log(identificationType);
        console.log(`**********************`);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_ic_no',datatablename,'patientNic',index);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_oldic_passport',datatablename,'patientPassport',index);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_passportexpiery',datatablename,'passportExpiery',index);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_countryofissue',datatablename,'countryofIssue',index);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_nationality',datatablename,'nationality',index);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_race',datatablename,'race',index);
            await BaseCommandCaller.getSelectedOptionTextAndStoreInJson(page,'PG_PatientRegistration.select_gender',datatablename,'genders',index);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_dob',datatablename,'dob',index);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_age',datatablename,'age',index);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_email',datatablename,'email',index);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_countrycode',datatablename,'countryCode',index);
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_mobileno',datatablename,'patientMobileNo',index);
            const isRemarkChecked = await BaseCommandCaller.getCheckboxState(page, 'PG_PatientRegistration.check_isaddpatientremark');
            if(isRemarkChecked === true){
                await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.textarea_addpatientremark',datatablename,'countryofIssue',index)
            }    
        
    }
    
    static async bc_HandleExistingPatientPatientInfoMandetoryFields (page: Page,expectedIdentificationType: string,gender: string,nicType:string,
        expectedCountryofIssue: string, expectedNationality: string, expectedRace: string, expectedEmail: string, datatablename: string, index: number, wait: number = 10000, countryCodeNeedSelect: boolean = false) 
        {
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientName(page,datatablename,index,wait);
            if(expectedIdentificationType === 'MyKAD'){

            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientIdentificationType(page,expectedIdentificationType,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientICNo(page,gender,nicType,datatablename,index,wait);
        }
        if(expectedIdentificationType === 'Passport' || expectedIdentificationType === 'Passport (Father)' || expectedIdentificationType === 'Passport (Mother)' || expectedIdentificationType === 'Passport (Others)'){
            
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientIdentificationType(page,expectedIdentificationType,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientOldIcorPassport(page,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientPassportExpiryDate(page,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientCountryofIssue(page,expectedCountryofIssue,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientNationality(page,expectedNationality,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientDoB(page,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientAge(page,datatablename,index,wait);
        }

        if(expectedIdentificationType === 'MyKAD (Mother)' || expectedIdentificationType === 'MyKAD (Father)' || expectedIdentificationType === 'MyKAD (Other)' || expectedIdentificationType === 'Passport (Others)'){
            
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientIdentificationType(page,expectedIdentificationType,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientOldIcorPassport(page,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientDoB(page,datatablename,index,wait);
            await LIB_CommonRegistrationFieldsEdit.bc_EditPatientAge(page,datatablename,index,wait);
        }

        await LIB_CommonRegistrationFieldsEdit.bc_EditPatientRace(page,expectedRace,datatablename,index,wait);
        await LIB_CommonRegistrationFieldsEdit.bc_EditPatientGender(page,gender,datatablename,index,wait);
        await LIB_CommonRegistrationFieldsEdit.bc_EditPatientEmail(page,expectedEmail,datatablename,index,wait);
        await LIB_CommonRegistrationFieldsEdit.bc_EditPatientMobileNo(page,datatablename,index,wait);

    }
    
    static async bc_HandleStoreExistingAdditionalPatientDetails(page: Page, datatablename: string, index: number) {
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_religion',datatablename,'religion',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_maritalstatus',datatablename,'maritalstatus',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_occupation',datatablename,'occupation',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_addhouseno',datatablename,'addHouseNo',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_addofficeno',datatablename,'addOfficeNo',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_street1',datatablename,'street1',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_street2',datatablename,'street2',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_street3',datatablename,'street3',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_street4',datatablename,'street4',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_country',datatablename,'countryAditionalInfo',index);
        const state = await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_states',datatablename,'state',index);
        if(!state){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.input_states');
            await BaseCommandCaller.selectFirstMatOption(page,'PG_Common.list_matoptions');
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_states',datatablename,'state',index);
        }
        const town = await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_town',datatablename,'town',index);
        if(!town){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.input_town');
            await BaseCommandCaller.selectFirstMatOption(page,'PG_Common.list_matoptions');
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_town',datatablename,'town',index);
        }
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_additionalpatientdetails_postcode',datatablename,'postalCode',index);
    }

    static async bc_HandleStoreExistingVisitAdmissionDetails(page: Page, datatablename: string, index: number) {
        await BaseCommandCaller.getSelectedOptionTextAndStoreInJson(page,'PG_PatientRegistration.select_patienttype',datatablename,'patientType',index);
        await BaseCommandCaller.getSelectedOptionTextAndStoreInJson(page,'PG_PatientRegistration.select_privatcategory',datatablename,'privateCategory',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_doctor',datatablename,'doctor',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_doctorspecialist',datatablename,'doctorSpeciality',index);
        await BaseCommandCaller.getCheckboxState(page,'PG_PatientRegistration.check_isdoctorchecked');
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_visittype',datatablename,'visitType',index);
        await BaseCommandCaller.getSelectedOptionTextAndStoreInJson(page,'PG_PatientRegistration.select_previleage',datatablename,'privilageType',index);
        
    }

    static async bc_HandleStoreExistingEmergencyContactDetails(page: Page, datatablename: string, index: number) {
        
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_contactpersonname',datatablename,'contactPersonName',index);
        await BaseCommandCaller.getSelectedOptionTextAndStoreInJson(page,'PG_PatientRegistration.select_gender_emergencycontactdetails',datatablename,'genderEmergencyContact',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_relationtype',datatablename,'relationType',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_street1_relationtype',datatablename,'street1Relation',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_street2_relationtype',datatablename,'street2Relation',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_street3_relationtype',datatablename,'street3Relation',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_street4_relationtype',datatablename,'street4Relation',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_country_relationtype',datatablename,'countryRelation',index);
        const state = await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_state_relationtype',datatablename,'stateRelation',index);
        if(!state){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.input_state_relationtype');
            await BaseCommandCaller.selectFirstMatOption(page,'PG_Common.list_matoptions');
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_state_relationtype',datatablename,'stateRelation',index);
        }
        const town  = await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_city_relationtype',datatablename,'townRelation',index);
        if(!town){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.input_city_relationtype');
            await BaseCommandCaller.selectFirstMatOption(page,'PG_Common.list_matoptions');
            await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_city_relationtype',datatablename,'townRelation',index);
        }
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_postcode_relationtype',datatablename,'postcodeRelation',index);

        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_countrycodemobile_relationtype',datatablename,'relationCountryCode',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_mobileno_relationtype',datatablename,'relationMobileNumber',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_officeno_relationtype',datatablename,'addhouseno',index);
        await BaseCommandCaller.getInputDataAndStoreInJson(page,'PG_PatientRegistration.input_houseno_relationtype',datatablename,'addofficeno',index);
    }

    static async bc_HandleAdditionalPatientDetailsExpandSection(page: Page, wait: number = 5000) {
        const isSectionExpand = await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.card_collapseaditionaldetails',wait,'hard');
        if(isSectionExpand){
        await BaseCommandCaller.click(page,'PG_PatientRegistration.card_collapseaditionaldetails');
        }
    }

    static async bc_HandleVisitAdmissionDetailsExpandSection(page: Page, wait: number = 5000) {
        const isSectionExpand = await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.card_collapsevisitadmissiondetails',wait,'hard');
       if(isSectionExpand){
        await BaseCommandCaller.click(page,'PG_PatientRegistration.card_collapsevisitadmissiondetails');
       }
    }
    
    static async bc_HandleEmergencyContactDetailsExpandSection(page: Page, wait: number = 5000) {
        const isSectionExpand = await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.card_collapseemergencycontact',wait,'hard');
       if(isSectionExpand){
        await BaseCommandCaller.click(page,'PG_PatientRegistration.card_collapseemergencycontact');
       }
    }

    static async bc_HandleEditExistingVisitAdmissionDetails(page: Page, expectedPatientType: string, expectedPrivateCategory: string, isPrivilege: boolean, expectedPrivilege: string, privilageRemark: string,corporateName: string, creditLimitExceed: string, creditBalanceLimit: string, corporateAmount: string, 
        coGuarantor: string, isReferredByClinic: boolean,clinicName: string, datatablename: string, index: number, wait: number) {

        
        await LIB_CommonRegistrationFieldsEdit.bc_EditVisitAdmissionDetailsPatientType(page,expectedPatientType,datatablename,index);
        if(expectedPatientType === 'Corporate'){
            await LIB_PatientRegistration.bc_HandleCorporateDetails(page,corporateName,creditLimitExceed,creditBalanceLimit,corporateAmount,coGuarantor,datatablename,index,wait);
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_savecorporate');
            const coporateName = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_disabled_displaycorporatename');
            console.log(coporateName);
        }
        await LIB_CommonRegistrationFieldsEdit.bc_EditVisitAdmissionDetailsPrivateCategory(page,expectedPrivateCategory,datatablename,index);
        const isDoctorFieldEnable = await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_doctor', wait, 'soft');
        if(!isDoctorFieldEnable){
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_addnewdoctor');
        }
        
        await LIB_CommonRegistrationFieldsEdit.bc_EditVisitAdmissionDetailsAddNewDoctor(page,datatablename,index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_doctorspecialist', datatablename,'doctorSpeciality', index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_doctor', datatablename,'doctor', index);
        const doctor = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_doctor');
        if(doctor === '' || doctor === 'null' || doctor === null){
            LIB_PatientRegistration.bc_HandleSelectDoctor(page);
        }
        const isDoctorChecked = await BaseCommandCaller.getCheckboxState(page,'PG_PatientRegistration.check_isdoctorchecked');
        if(!isDoctorChecked){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.check_isdoctorchecked');
        }
       
        await BaseCommandCaller.assertCheckboxState(page,'PG_PatientRegistration.check_isdoctorchecked',true);
        if(isPrivilege === true){
            await LIB_CommonRegistrationFieldsEdit.bc_EditVisitAdmissionDetailsPrivilege(page,expectedPrivilege,datatablename,index);
            await LIB_CommonRegistrationFieldsEdit.bc_EditVisitAdmissionDetailsPrivilegeAddRemark(page,privilageRemark,datatablename,index);
        }
        if(isReferredByClinic === true){
            const updatedData = DataHelper.reloadData(datatablename);
            const updadtedDoctore = updatedData[index].doctor;
            await LIB_PatientRegistration.bc_HandleReferbyExternalClinic(page,clinicName,updadtedDoctore,datatablename,index);
        }
        

    }

    static async bc_VerifyExistingPatientRegistrationDetailsinVisitAdmission (page: Page,isPrivilege: boolean, privilageType: string, privilageRemark: string, datatablename: string, index: number, wait: number = 10000) {

     
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_admissiondetails',wait, 'hard');
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientType = updatedData[index].expectedPatientType;
        const updadtedPrivateCategory = updatedData[index].expectedPrivateCategory;
        const updadtedDoctorSpeciality = updatedData[index].doctorSpeciality;
        const updadtedDoctor = updatedData[index].doctor;
        await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_patienttype', updadtedPatientType);
        await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_privatcategory', updadtedPrivateCategory);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_doctorspecialist', updadtedDoctorSpeciality);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_doctor', updadtedDoctor);
        if(isPrivilege){
            await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_previleage', privilageType);
            await BaseCommandCaller.assertCheckboxState(page,'PG_PatientRegistration.check_isaddremarkchecked', true);
            await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.textarea_addremark', privilageRemark);
        }

    }

    static async bc_HandleExistingEmergencyContactDetailsMandetoryFields (page: Page,expectedGender: string, expectedRelationType: string,gender: string,nicType: string,emergencyExpectedStreet1: string,
        emergencyExpectedStreet2: string,emergencyExpectedStreet3: string,emergencyExpectedStreet4: string,emergencyExpectedCountry: string,
        emergencyExpectedState: string,emergencyExpectedTown: string,emergencyExpectedPostalCode: string, datatablename: string, index: number) {
    
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsContactName(page,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsGender(page,expectedGender,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsRelationshipType(page,expectedRelationType,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsIcNo(page,gender,nicType,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsStreet1(page,emergencyExpectedStreet1,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsStreet2(page,emergencyExpectedStreet2,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsStreet3(page,emergencyExpectedStreet3,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsStreet4(page,emergencyExpectedStreet4,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsCountry(page,emergencyExpectedCountry,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsState(page,emergencyExpectedState,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsTown(page,emergencyExpectedTown,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsPostalCode(page,emergencyExpectedPostalCode,datatablename,index);
        await LIB_CommonRegistrationFieldsEdit.bc_EditEmergencyContactDetailsMobileNo(page,datatablename,index);
    }

    static async bc_VerifyExistingPatientRegistrationDetailsinEmergencyContact(page: Page,datatablename: string,index: number, wait: number = 10000) {
    
        const updatedData = DataHelper.reloadData(datatablename);
        if (!updatedData || !updatedData[index]) {
            throw new Error(`Invalid or missing data at index ${index} in table ${datatablename}`);
        }
    
        const {
            contactPersonName,
            genderEmergencyContact,
            relationType,
            street1Relation,
            street2Relation,
            street3Relation,
            street4Relation,
            countryRelation,
            stateRelation,
            townRelation,
            postcodeRelation,
            relationCountryCode,
            relationMobileNumber,
            street1,
            street2,
            street3,
            street4,
            countryAditionalInfo,
            state,
            town,
            postalCode,
        } = updatedData[index];
    
        console.log('Loaded updated data:', updatedData[index]);
    
        // Ensure locator is present
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.card_admissiondetails', wait, 'hard');
        await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
        // Basic field assertions
        console.log('Verifying contact person details...');
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_contactpersonname', contactPersonName);
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_relationtype', relationType);
        await BaseCommandCaller.assertSelectedOption(page, 'PG_PatientRegistration.select_gender_emergencycontactdetails', genderEmergencyContact);
        
        const isSamePatientAddress = await BaseCommandCaller.getCheckboxState(page,'PG_PatientRegistration.check_sameaspatientaddress');
        
        if (isSamePatientAddress) {
            console.log('Verifying patient address fields...');
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street1_relationtype', street1);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street2_relationtype', street2);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street3_relationtype', street3);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street4_relationtype', street4);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_country_relationtype', countryAditionalInfo);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_state_relationtype', state);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_city_relationtype', town);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_postcode_relationtype', postalCode);
        } else {
            console.log('Verifying emergency contact address fields...');
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street1_relationtype', street1Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street2_relationtype', street2Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street3_relationtype', street3Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_street4_relationtype', street4Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_country_relationtype', countryRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_state_relationtype', stateRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_city_relationtype', townRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_postcode_relationtype', postcodeRelation);
        }
    
        // Common emergency contact details
        console.log('Verifying emergency contact phone details...');
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_countrycodemobile_relationtype', relationCountryCode);
        await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_mobileno_relationtype', relationMobileNumber);
    
        console.log('Completed bc_VerifyRegistrationDetailsinEmergencyContact');
    }

    static async bc_HandleGuardianDetailsExpandSection(page: Page, wait: number = 5000) {
        const isSectionExpand = await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.card_collapseguardian',wait,'hard');
       if(isSectionExpand){
        await BaseCommandCaller.click(page,'PG_PatientRegistration.card_collapseguardian');
       }
    }

    static async bc_HandleStoreExistingGuardianDetails(page: Page, datatablename: string, index: number) {
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianname',datatablename,'guardianName',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardiantinnumber',datatablename,'guardianTin',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianicno',datatablename,'guardianIcNo',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianoldicnoorpassport',datatablename,'guardianPassport',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardiannationality',datatablename,'guardianNationality',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianemail',datatablename,'guardianEmail',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianstreet1',datatablename,'guardianStreet1',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianstreet2',datatablename,'guardianStreet2',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianstreet3',datatablename,'guardianStreet3',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianstreet4',datatablename,'guardianStreet4',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardiancountry',datatablename,'guardianCountry',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianstate',datatablename,'guardianState',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardiancity',datatablename,'guardianCity',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianpostcode',datatablename,'guardianPostCode',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardiancountrycode',datatablename,'guardianCountryCode',index);
        await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_guardianmobileno',datatablename,'guardianMobileNo',index);
        
    }


    static async bc_HandleExistingGuardianDetailsManderoryFields(page: Page, guardianCountryCode: string, 
        guardianStreet1: string,guardianCountry: string, guardianState: string, guardianCity: string, datatablename: string, index: number) {
        const name = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_guardianname');
        const icNo = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_guardianicno');
        const countryCode = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_guardiancountrycode');
        const street1 = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_guardianstreet1');
        const country = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_guardiancountry');
        const state = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_guardianstate');
        const city = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_guardiancity');
        const mobileNo = await BaseCommandCaller.getInputData(page,'PG_PatientRegistration.input_guardianmobileno');
        console.log(name);
        if(name === null || name === ''){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardianname');
            const guardianName =  await NameGenerator.generateAndUpdateJson('guardianName',datatablename,index)
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_guardianname',guardianName);
        }
        console.log(icNo);
        if(icNo === null || icNo === ''){
            
            const generatedNic = await NICGenerator.generateAndUpdateNIC('male','guardianNic',datatablename,index,'MyKAD');
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardianicno');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_guardianicno',generatedNic);
            await BaseCommandCaller.tab(page,'PG_PatientRegistration.input_guardianicno');
        }
        console.log(street1);
        if(street1 === null || street1 === ''){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardianstreet1');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_guardianstreet1',guardianStreet1);
        }

        if(country === null || country === ''){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardiancountry');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_guardiancountry',guardianCountry);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardiancountry');
            await BaseCommandCaller.click(page,'PG_PatientRegistration.input_guardiancountry');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', guardianCountry);
        }
        console.log(state);
        if(state === null || state === ''){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardianstate');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_guardianstate',guardianState);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardianstate');
            await BaseCommandCaller.click(page,'PG_PatientRegistration.input_guardianstate');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', guardianState);
        }
        console.log(city);
        if(city === null || city === ''){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardiancity');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_guardiancity',guardianCity);
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardiancity');
            await BaseCommandCaller.click(page,'PG_PatientRegistration.input_guardiancity');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', guardianCity);
        }

        console.log(countryCode);
        if(countryCode === null || countryCode === ''){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardiancountrycode');
            await BaseCommandCaller.click(page,'PG_PatientRegistration.input_guardiancountrycode');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', guardianCountryCode);
        }
        console.log(mobileNo);
        if(mobileNo === null || mobileNo === ''){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_guardianmobileno');
            const genMobileNo = await MobileNumberGenerator.generateAndUpdateJson('guardianMobileNo',datatablename,index);
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_guardianmobileno',genMobileNo);
            
        }
    }

    static async bc_HandleGuardianDetails(page: Page,isGuardianMrn: boolean,guardianMrn: string,isSameAsEmergencyDetails: boolean,
        street1Relation: string,street2Relation: string,street3Relation: string,street4Relation: string,countryRelation: string,
        stateRelation: string,townRelation: string,postcodeRelation: string,relationCountryCode: string, relationMobileNumber: string,
        guardianCountryCode: string,guardianStreet1: string,guardianCountry: string,guardianState: string,guardianCity: string, datatablename: string, index: number, wait: number) {

        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.check_sameasemergencydetails',wait, 'soft' );
        await LIB_PatientRegistration.bc_HandleExistingGuardianDetailsManderoryFields(page,guardianCountryCode,guardianStreet1,guardianCountry,guardianState,guardianCity,datatablename,index);
        if(isGuardianMrn){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_guardianmrn', wait, 'hard');
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_guardianmrn');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_guardianmrn', guardianMrn);
            await BaseCommandCaller.tab(page, 'PG_PatientRegistration.input_guardianmrn');
            await LIB_PatientRegistration.bc_HandleStoreExistingGuardianDetails(page,datatablename,index);

        }
        if(isSameAsEmergencyDetails){
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardianstreet1', street1Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardianstreet2', street2Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardianstreet3', street3Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardianstreet4', street4Relation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardiancountry', countryRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardianstate', stateRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardiancity', townRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardianpostcode', postcodeRelation);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardiancountrycode', relationCountryCode);
            await BaseCommandCaller.getInputDataAndAssert(page, 'PG_PatientRegistration.input_guardianmobileno', relationMobileNumber);
        }
        await LIB_PatientRegistration.bc_HandleExistingGuardianDetailsManderoryFields(page,guardianCountryCode,guardianStreet1,guardianCountry,guardianState,guardianCity,datatablename,index);
    }

    static async bc_HandleAddNewContact(page: Page, addNewContactGender: string,relationShipType: string,nicType: string, 
        street1Relation: string,street2Relation: string,street3Relation: string,street4Relation: string,countryRelation: string,
        stateRelation: string, townRelation: string, postcodeRelation: string, countryCode: string, datatablename: string, index: number) {
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_name_addnewcontact');
        const name = await NameGenerator.generateAndUpdateJson('addNewContactName',datatablename,index);
        await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_name_addnewcontact',name);
        await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_gender_addnewcontact', addNewContactGender);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_relationship_addnewcontact');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_relationship_addnewcontact', relationShipType);
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', relationShipType);
        const nicNo = await NICGenerator.generateAndUpdateNIC(addNewContactGender,'addNewContactNIC',datatablename,index,nicType);
        await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_icno_addnewcontact',nicNo);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_street1_addnewcontact');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street1_addnewcontact', street1Relation);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_street2_addnewcontact');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street2_addnewcontact', street2Relation);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_street3_addnewcontact');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street3_addnewcontact', street3Relation);
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_street4_addnewcontact');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street4_addnewcontact', street4Relation);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_country_addnewcontact');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_country_addnewcontact');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', countryRelation);
        
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_states_addnewcontact');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_states_addnewcontact');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', stateRelation);
        
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_town_addnewcontact');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_town_addnewcontact');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', townRelation);
        
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_postcode_addnewcontact');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_postcode_addnewcontact', postcodeRelation);  
        
        // await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_countrycodemobile_addnewcontact');
        // await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_countrycodemobile_addnewcontact');
        // await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', countryCode);
        await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_countrycodemobile_addnewcontact', countryCode);
        const mobile = await MobileNumberGenerator.generateAndUpdateJson('addNewContactMobileNo',datatablename,index);
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mobileno_addnewcontact');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mobileno_addnewcontact', mobile); 
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_add');

        
    }

    

    static async bc_HandleClickOnRequestForAdmissionButton(page: Page, wait: number = 5000) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_requestforadmission',wait,'hard');
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_requestforadmission');
        await BaseCommandCaller.waitUntilLocatorInvisible(page,'PG_Common.spiner_loading', wait);
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.label_requestforadmission',wait,'hard');
    }

    static async bc_HandleClickOnEditButton(page: Page, wait: number = 5000) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_navigationedit',wait,'hard');
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_navigationedit');
        await BaseCommandCaller.waitUntilLocatorInvisible(page,'PG_Common.spiner_loading', wait);
        await BaseCommandCaller.hardPause(page,wait)
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_navigationedit',wait,'hard');
    }

    static async bc_HandleClickOnOkPopUPButton(page: Page, wait: number = 5000) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_ok',wait,'hard');
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_ok');
        await BaseCommandCaller.waitUntilLocatorInvisible(page,'PG_Common.spiner_loading', wait);
        await BaseCommandCaller.hardPause(page,wait)
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_ok',wait,'hard');
    }

    static async bc_HandleSearchRFAinPatientRegistration(page: Page,fromDate: string, toDate: string, rfaId: string, wait: number = 5000) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.label_requestforadmission',wait,'hard');
        const todayDate = await generateDate('today');
        if(fromDate !== todayDate && fromDate !== '' && fromDate !== null){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_scheduleadmissionfromdate');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_scheduleadmissionfromdate',fromDate);
        }
        if(toDate !== todayDate && toDate !== '' && toDate !== null){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_scheduleadmissiontodate');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_scheduleadmissiontodate',toDate);
        }
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_admittingrfaid');
        await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_admittingrfaid', rfaId);
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_go');
        const results_link_locator = 'PG_PatientRegistration_Locators.chek_resultrfa';
        const resolving_results_link_locator = resolveLocator(results_link_locator);
        const resolved_results_link_locator = getLocatorWithDynamicValue(resolving_results_link_locator,'{rfaID}', rfaId);
        await BaseCommandCaller.hardPause(page, wait);
        await BaseCommandCaller.hardPause(page, wait);
        await BaseCommandCaller.click(page,resolved_results_link_locator);
        await BaseCommandCaller.assertCheckboxState(page,resolved_results_link_locator,true);
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_admissionselect');
        await BaseCommandCaller.waitUntilLocatorInvisible(page,'PG_Common.spiner_loading', wait);
        await BaseCommandCaller.hardPause(page, wait);
        
    }

    static async bc_HandleAdmissionExpandSection(page: Page, wait: number = 5000) {
        const isSectionExpand = await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.card_collapseadmission',wait,'hard');
        if(isSectionExpand){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.card_collapseadmission');
        }
    }

    static async bc_HandleAddNewContactExpandSection(page: Page, wait: number = 5000) {
        const isSectionExpand = await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.card_collapseaddnewcontact',wait,'hard');
        if(isSectionExpand){
            await BaseCommandCaller.click(page,'PG_PatientRegistration.card_collapseaddnewcontact');
        }
    }

    static async bc_HandleAdmission(page: Page,ward: string,bedType: string, wait: number = 5000) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.radio_transferpatient',wait,'hard');
        await BaseCommandCaller.hardPause(page,wait);
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.check_wardandbed',wait,'hard');
        //    await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_ward',ward);
        //    await BaseCommandCaller.getInputDataAndAssert(page,'PG_PatientRegistration.input_bedtype',bedType);
        await BaseCommandCaller.click(page,'PG_PatientRegistration.check_wardandbed');
    }

    static async bc_HandleClickOnNavEdit(page: Page,wait: number = 5000) {
        
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_navigationedit',wait,'hard');
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_navigationedit');
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.popup_labelafterclickedit',wait,'hard');
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_ok',wait,'hard');
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_ok');
        await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_chargetype','InPatient');
    }

    static async bc_VerifyChargeTypeisInPatient(page: Page, wait: number = 5000) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.select_chargetype',wait,'hard');
        await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_chargetype','InPatient');
    }

    static async bc_VerifyChargeTypeisOutPatient(page: Page, wait: number = 5000) {
        await BaseCommandCaller.hardPause(page,wait,true,'Waiting for change the Status');
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.select_chargetype',wait,'hard');
        await BaseCommandCaller.assertSelectedOption(page,'PG_PatientRegistration.select_chargetype','OutPatient');
    }

    static async bc_CancelAdmission(page: Page, cancelationReason: string, wait: number = 5000) {
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_canceladmission',wait,'hard');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_canceladmission');
        await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.button_ok');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.button_ok');
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.header_popupcancelreason');
        await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_admissioncancelationreason',cancelationReason);
        await BaseCommandCaller.click(page,'PG_PatientRegistration.button_admissioncancelsave');
    }
    

}