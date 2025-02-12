// LIB_CommonRegistrationFieldsEdit.ts

import { Page, expect  } from '@playwright/test';
import { BaseCommandCaller as BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';  import { NameGenerator  } from '../Runtime/Utilities/NameGenerator';
import { NICGenerator  } from '../Runtime/Utilities/NICGenerator';
import { MobileNumberGenerator  } from '../Runtime/Utilities/MobileNumberGenerator';
import { PassportNumberGenerator  } from '../Runtime/Utilities/PassportNumberGenerator';
import { PassportExpiryGenerator } from '../Runtime/Utilities/generateAndUpdateExpiryDate';
import { DOBGenerator} from '../Runtime/Utilities/DOBGenerator';
import { DataHelper} from '../Runtime/Helpers/DataHelper'; 
import { LIB_PatientRegistration } from './LIB_PatientRegistration';

export class LIB_CommonRegistrationFieldsEdit {

    static async bc_EditPatientName(page: Page, datatablename: string, index: number, wait: number ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientName = updatedData[index].patientName;
        if(updadtedPatientName === "null" ){
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_patientname',wait,'hard');
        const patientName = await NameGenerator.generateAndUpdateJson('patientName', datatablename, index)
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_patientname');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_patientname', patientName, true);
       } 
       
    }

    static async bc_EditPatientIdentificationType(page: Page, expectedIdentificationType: string, datatablename: string, index: number, wait: number ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedidentificationType = updatedData[index].identificationType;
        if(updadtedidentificationType === "null" ){
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_identificationtype',wait,'hard');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_identificationtype');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_identificationtype');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedIdentificationType);
       } 
       
    }

    static async bc_EditPatientICNo(page: Page, gender: string, nicType: string, datatablename: string, index: number, wait: number ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedpatientNic = updatedData[index].patientNic;
        if(updadtedpatientNic === "null" ){
        await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_ic_no',wait,'hard');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_ic_no');
        const patientNicNo = await NICGenerator.generateAndUpdateNIC( gender,'patientNic', datatablename, index,nicType)
        console.log(patientNicNo);
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_ic_no', patientNicNo);
       } 
       
    }

    static async bc_EditPatientOldIcorPassport(page: Page,  datatablename: string, index: number, wait: number ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientPassport = updatedData[index].patientPassport;
        if(updadtedPatientPassport === "null" ){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_oldic_passport',wait, 'soft');
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_oldic_passport');
            const passportNumber = await PassportNumberGenerator.generateAndUpdatePassportNumber('patientPassport', datatablename, index)
            console.log(passportNumber);
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_oldic_passport', passportNumber);
       } 
       
    }

    static async bc_EditPatientPassportExpiryDate(page: Page,  datatablename: string, index: number, wait: number ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientPassportExpiery = updatedData[index].passportExpiery;
        if(updadtedPatientPassportExpiery === "null" ){
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_passportexpiery',wait, 'soft');
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_passportexpiery');
        const expieryDate = await PassportExpiryGenerator.generateAndUpdateExpiryDate('expieryDate',datatablename, index);
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_passportexpiery', expieryDate);
       } 
       
    }

    static async bc_EditPatientCountryofIssue(page: Page, expectedCountryofIssue: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedCountryofIssue = updatedData[index].countryofIssue;
        if(updadtedCountryofIssue === "null" ){
            await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_countryofissue',wait,'hard');
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_countryofissue');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_countryofissue');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions',expectedCountryofIssue);
       } 
       
    }

    static async bc_EditPatientNationality(page: Page, expectedNationality: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedNationality = updatedData[index].nationality;
        if(updadtedNationality === "null" ){
            await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_nationality',wait,'hard');
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_nationality');
            await BaseCommandCaller.fill(page,'PG_PatientRegistration.input_nationality',expectedNationality);
       } 
       
    }

    static async bc_EditPatientRace(page: Page, expectedRace: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientRace = updatedData[index].race;
        if(updadtedPatientRace === "null" ){
            await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_race',wait,'hard');
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_race');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_race');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions',expectedRace);
       } 
       
    }

    static async bc_EditPatientGender(page: Page, expectedGender: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientGender = updatedData[index].genders;
        if(updadtedPatientGender === "null" ){
            await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.select_gender',wait,'hard');
            await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_gender',expectedGender);
       } 
       
    }

    static async bc_EditPatientDoB(page: Page, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientDob = updatedData[index].dob;
        if(updadtedPatientDob === "null" ){
        const ageAndDOB = await DOBGenerator.generateAndUpdateDOB('expectedDob','expectedAge', datatablename, index);
        console.log(ageAndDOB);
        // Destructure dob and age from the returned object
        const {dob} = ageAndDOB;
        await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_dob');
        await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_dob', dob);
       } 
       
    }

    static async bc_EditPatientAge(page: Page, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientAge = updatedData[index].age;
        const updadtedPatientExpectedAge = updatedData[index].expectedAge;
        if(updadtedPatientAge === "null" ){
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_age');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_age', updadtedPatientExpectedAge);
       } 
       
    }

    static async bc_EditPatientEmail(page: Page, expectedEmail: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientEmail = updatedData[index].email;
        if(updadtedPatientEmail === "null" ){
            await BaseCommandCaller.isLocatorPresent(page,'PG_PatientRegistration.input_email',wait,'hard');
            await BaseCommandCaller.clearTextField(page,'PG_PatientRegistration.input_email');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_email', expectedEmail);
       } 
       
    }

    static async bc_EditPatientCountryCode(page: Page, expectedCountryCode: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientCountryCode = updatedData[index].countryCode;
        if(updadtedPatientCountryCode === "null" ){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_countrycode',wait, 'soft');
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_countrycode');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_countrycode');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedCountryCode);
       } 
       
    }

    static async bc_EditPatientMobileNo(page: Page, datatablename: string, index: number, wait: number = 3000 ) {
        // const updatedData = DataHelper.reloadData(datatablename);
        // const updadtedPatientMobileNo = updatedData[index].patientMobileNo;
        // if(updadtedPatientMobileNo === "null" ){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_mobileno',wait, 'soft');
            const patientMobileNo = await MobileNumberGenerator.generateAndUpdateJson('patientMobileNo', datatablename, index);
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mobileno');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mobileno', patientMobileNo);
    //    } 
       
    }


    static async bc_EditPatientRemarkIsChecked(page: Page, expectedAddPatientRemark: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedAddPatientRemark = updatedData[index].addPatientRemark;
        const isCheckRemark = await BaseCommandCaller.getCheckboxState(page, 'PG_PatientRegistration.check_isaddpatientremark');
        if(isCheckRemark){
            if(updadtedAddPatientRemark === "null" ){
                await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.textarea_addpatientremark',wait, 'soft');
                await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.textarea_addpatientremark');
                await BaseCommandCaller.fill(page,'PG_PatientRegistration.textarea_addpatientremark', expectedAddPatientRemark);
            } 
        }
    }

    static async bc_EditAdditionalPatientDetailsReligion(page: Page,expectedReligion: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedReligion = updatedData[index].religion;
        if(updadtedReligion === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_religion');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_religion');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedReligion);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsMaritalStatus(page: Page,expectedMaritalStatus: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedMaritalStatus = updatedData[index].maritalStatus;
        if(updadtedMaritalStatus === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_maritalstatus');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_maritalstatus');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedMaritalStatus);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsOccupation(page: Page,expectedOccupation: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedOccupation = updatedData[index].occupation;
        if(updadtedOccupation === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_occupation');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_occupation', expectedOccupation);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsHouseCountryCode(page: Page,expectedAddHouseCountryCode: string, datatablename: string, index: number, wait: number = 3000 ) {
        
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_addhousenocode');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_addhousenocode');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedAddHouseCountryCode);
        
    }

    static async bc_EditAdditionalPatientDetailsHouseNo(page: Page,expectedAddhouseNo: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedAddHouseNo = updatedData[index].addHouseNo;
        if(updadtedAddHouseNo === "null" ){
            const addhouseno = await MobileNumberGenerator.generateAndUpdateJson('expectedAddhouseNo', datatablename, index);
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_addhouseno');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_addhouseno', addhouseno);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsOfficeNoCountryCode(page: Page,expectedAddOfficeNoCountryCode: string, datatablename: string, index: number, wait: number = 3000 ) {
        
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_addofficenocode');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_addofficenocode');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedAddOfficeNoCountryCode);
    
    }

    static async bc_EditAdditionalPatientDetailsOfficeNo(page: Page, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedaddOfficeNo = updatedData[index].addOfficeNo;
        if(updadtedaddOfficeNo === "null" ){
            const addofficeno = await MobileNumberGenerator.generateAndUpdateJson('expectedAddOfficeNo', datatablename, index);
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_addofficeno');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_addofficeno', addofficeno);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsStreet1(page: Page,expectedStreet1: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedStreet1 = updatedData[index].street1;
        if(updadtedStreet1 === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street1');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street1', expectedStreet1);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsStreet2(page: Page,expectedStreet2: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedStreet2 = updatedData[index].street2;
        if(updadtedStreet2 === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street2');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street2', expectedStreet2);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsStreet3(page: Page,expectedStreet3: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedStreet3 = updatedData[index].street3;
        if(updadtedStreet3 === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street3');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street3', expectedStreet3);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsStreet4(page: Page,expectedStreet4: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedStreet4 = updatedData[index].street4;
        if(updadtedStreet4 === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street4');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street4', expectedStreet4);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsCountry(page: Page,expectedCountryAditionalInfo: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedCountry = updatedData[index].countryAditionalInfo;
        if(updadtedCountry === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_country');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_country');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedCountryAditionalInfo);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsState(page: Page,expectedState: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedState = updatedData[index].state;
        if(updadtedState === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_states');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_states');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedState);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsTown(page: Page,expectedTown: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedTown = updatedData[index].town;
        if(updadtedTown === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_town');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_town');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedTown);
        } 
        
    }

    static async bc_EditAdditionalPatientDetailsPostalCode(page: Page,expectedPostalCode: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPostalCode = updatedData[index].postalCode;
        if(updadtedPostalCode === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_additionalpatientdetails_postcode');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_additionalpatientdetails_postcode', expectedPostalCode);
        } 
        
    }


    static async bc_EditVisitAdmissionDetailsPatientType(page: Page,expectedPatientType: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPatientType = updatedData[index].patientType;
        if(updadtedPatientType === "Select Patient Type" ){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_patienttype',wait, 'soft');
            await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_patienttype', expectedPatientType);
        } 
        
    }

    static async bc_EditVisitAdmissionDetailsPrivateCategory(page: Page,expectedPrivateCategory: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPrivateCategory = updatedData[index].privateCategory;
        if(updadtedPrivateCategory === "Select Private Category" ){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_privatcategory',wait, 'soft');
            await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_privatcategory', expectedPrivateCategory);
        } 
        
    }

    static async bc_EditVisitAdmissionDetailsAddNewDoctor(page: Page,datatablename: string, index: number,  wait: number = 3000 ) {
        await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_doctor',wait, 'soft');
        const isDrChecked = await BaseCommandCaller.getCheckboxState(page, 'PG_PatientRegistration.check_isdoctorchecked')
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedDoctor = updatedData[index].doctor;
        if(isDrChecked === true ){
           
            if(updadtedDoctor === "null" || updadtedDoctor === "" || updadtedDoctor === null){
                await LIB_PatientRegistration.bc_HandleSelectDoctor(page);
                await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_doctorspecialist', datatablename,'doctorSpeciality', index);
                await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_doctor', datatablename,'doctor', index);
            }
        } 

        if(isDrChecked === false ){
           
            if(updadtedDoctor === "null" || updadtedDoctor === "" || updadtedDoctor === null){
                await LIB_PatientRegistration.bc_HandleSelectDoctor(page);
                await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_doctorspecialist', datatablename,'doctorSpeciality', index);
                await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_doctor', datatablename,'doctor', index);
                await BaseCommandCaller.click(page,'PG_PatientRegistration.check_isdoctorchecked');
            }
        } 
        
    }

    static async bc_EditVisitAdmissionDetailsVisitType(page: Page,expectedVisitType: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedVisitType = updatedData[index].visitType;
        if(updadtedVisitType === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_visittype');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_visittype');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedVisitType);
        } 
        
    }
    

    static async bc_EditVisitAdmissionDetailsPrivilege(page: Page,expectedPrivilege: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPrivilege = updatedData[index].privilege;
        if(updadtedPrivilege === "Select Privilege" ){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_previleage',wait, 'soft');
            await BaseCommandCaller.selectOption(page,'PG_PatientRegistration.select_previleage', expectedPrivilege);
        } 
        
    }

    static async bc_EditVisitAdmissionDetailsPrivilegeAddRemark(page: Page,expectedPrivilegeRemark: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPrivilegeRemark = updatedData[index].privilegeRemark;
        const isCheckedAddRemark = await BaseCommandCaller.getCheckboxState(page, 'PG_PatientRegistration.check_isaddremarkchecked');
        if(isCheckedAddRemark === false ){
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.check_isaddremarkchecked');
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.textarea_addremark');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.textarea_addremark', expectedPrivilegeRemark);
        } 

        if(isCheckedAddRemark === true ){
            if(updadtedPrivilegeRemark === "null"){
                await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.textarea_addremark');
                await BaseCommandCaller.fill(page, 'PG_PatientRegistration.textarea_addremark', expectedPrivilegeRemark);
            }
            
        } 
            
    }

    static async bc_EditEmergencyContactDetailsContactName(page: Page, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedContactPersonName = updatedData[index].contactPersonName;
        if(updadtedContactPersonName === "null" ){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.input_contactpersonname',wait, 'soft');
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_contactpersonname');
            const name = await NameGenerator.generateAndUpdateJson('contactPersonName',datatablename,index);
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_contactpersonname', name);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsGender(page: Page,expectedGender: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedGenderEmergencyContact = updatedData[index].genderEmergencyContact;
        if(updadtedGenderEmergencyContact === "Select Gender" ){
            await BaseCommandCaller.isLocatorPresent(page, 'PG_PatientRegistration.select_gender_emergencycontactdetails',wait, 'soft');
            await BaseCommandCaller.selectOption(page, 'PG_PatientRegistration.select_gender_emergencycontactdetails',expectedGender );
            await BaseCommandCaller.getSelectedOptionTextAndStoreInJson(page,'PG_PatientRegistration.select_gender_emergencycontactdetails',datatablename,'genderEmergencyContact',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsRelationshipType(page: Page,expectedRelationType: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedRelationType = updatedData[index].relationType;
        if(updadtedRelationType === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_relationtype');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_relationtype');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedRelationType);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_relationtype',datatablename,'relationType',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsIcNo(page: Page,gender: string,nicType: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedEmergencyDetailsIcNo = updatedData[index].emergencyDetailsIcNo;
        if(updadtedEmergencyDetailsIcNo === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_icno_relationtype');
            const EmergencyNicNo = await NICGenerator.generateAndUpdateNIC( gender,'emergencyDetailsIcNo', datatablename, index,nicType)
            console.log(EmergencyNicNo);
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_ic_no', EmergencyNicNo);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsStreet1(page: Page,emergencyExpectedStreet1: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedStreet1 = updatedData[index].emergencyStreet1;
        if(updadtedStreet1 === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street1_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street1_relationtype', emergencyExpectedStreet1);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_street1_relationtype',datatablename,'emergencyStreet1',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsStreet2(page: Page,emergencyExpectedStreet2: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedStreet2 = updatedData[index].emergencyStreet2;
        if(updadtedStreet2 === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street2_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street2_relationtype', emergencyExpectedStreet2);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_street2_relationtype',datatablename,'emergencyStreet2',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsStreet3(page: Page,emergencyExpectedStreet3: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedStreet3 = updatedData[index].emergencyStreet3;
        if(updadtedStreet3 === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street3_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street3_relationtype', emergencyExpectedStreet3);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_street3_relationtype',datatablename,'emergencyStreet3',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsStreet4(page: Page,emergencyExpectedStreet4: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedStreet4 = updatedData[index].emergencyStreet4;
        if(updadtedStreet4 === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_street4_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_street4_relationtype', emergencyExpectedStreet4);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_street4_relationtype',datatablename,'emergencyStreet4',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsCountry(page: Page,emergencyExpectedCountry: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedCountry = updatedData[index].emergencyCountry;
        if(updadtedCountry === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_country_relationtype');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_country_relationtype');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', emergencyExpectedCountry);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_country_relationtype',datatablename,'emergencyCountry',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsState(page: Page,emergencyExpectedState: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedState = updatedData[index].stateRelation;
        if(updadtedState === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_state_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_state_relationtype',emergencyExpectedState);
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', emergencyExpectedState);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_state_relationtype',datatablename,'emergencyState',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsTown(page: Page,emergencyExpectedTown: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedTown = updatedData[index].townRelation;
        if(updadtedTown === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_city_relationtype');
            await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_city_relationtype');
            await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', emergencyExpectedTown);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_city_relationtype',datatablename,'emergencyTown',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsPostalCode(page: Page,emergencyExpectedPostalCode: string, datatablename: string, index: number, wait: number = 3000 ) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedPostalCode = updatedData[index].emergencyPostalCode;
        if(updadtedPostalCode === "null" ){
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_postcode_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_postcode_relationtype', emergencyExpectedPostalCode);
            await BaseCommandCaller.storeDataFromLocatorToJson(page,'PG_PatientRegistration.input_postcode_relationtype',datatablename,'emergencyPostalCode',index);
        } 
        
    }

    static async bc_EditEmergencyContactDetailsMobileNoCountryCode(page: Page,expectedAddOfficeNoCountryCode: string) {
        
        await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_countrycodemobile_relationtype');
        await BaseCommandCaller.click(page, 'PG_PatientRegistration.input_countrycodemobile_relationtype');
        await BaseCommandCaller.selectMatOptionByText(page,'PG_Common.list_matoptions', expectedAddOfficeNoCountryCode);
    
    }

    static async bc_EditEmergencyContactDetailsMobileNo(page: Page, datatablename: string, index: number) {
        const updatedData = DataHelper.reloadData(datatablename);
        const updadtedaddOfficeNo = updatedData[index].relationMobileNumber;
        if(updadtedaddOfficeNo === "null" ){
            const addoMobileNo = await MobileNumberGenerator.generateAndUpdateJson('relationMobileNumber', datatablename, index);
            await BaseCommandCaller.clearTextField(page, 'PG_PatientRegistration.input_mobileno_relationtype');
            await BaseCommandCaller.fill(page, 'PG_PatientRegistration.input_mobileno_relationtype', addoMobileNo);
        } 
        
    }

}