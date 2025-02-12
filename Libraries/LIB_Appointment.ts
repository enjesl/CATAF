// LIB_Appointment.ts

import { Page, expect, request } from '@playwright/test';
import { BaseCommandCaller as BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';  // Import Playwright wrapper methods
import { getLocatorWithDynamicValue, locators, PG_MicrosoftLogin_Locators, resolveLocator } from '../Runtime/Helpers/LocatorHelper';  // Import locators from LocatorHelper
import { ApiUtils } from '../Runtime/Utilities/ApiUtils';  // Import ApiUtils
import { NICGenerator } from '../Runtime/Utilities/NICGenerator';
import { MobileNumberGenerator } from '../Runtime/Utilities/MobileNumberGenerator';
import { generateAppointmentDateTimeForMalaysia } from '../Runtime/Utilities/DateGenerator';
import { NameGenerator } from '../Runtime/Utilities/NameGenerator';
import { BrowserTokenHelper } from '../Runtime/Helpers/BrowserTokenHelper';

export class LIB_Appointment {

    static async bc_AddAppoinmentAPI(page: Page, gender: string,nicType: string, dtColoumnNameNic: string,dtColoumnNameDOB: string, dtColoumnNameAge: string,dtColoumnNameMobileNumber: string,apoinmentTime: string, 
        apoinmentDuration: string, dtColoumnNameName:string,doctorCode: string,email: string, dataTable: string, index: number, apiEndPoint: string) {
      
        const bearerToken = await LIB_Appointment.bc_GetBareerToken(page);
        const slotMinutes: number = Number(apoinmentDuration);

        const icNo = await NICGenerator.generateAndUpdateNIC(gender, dtColoumnNameNic, dataTable, index, nicType);
        const birthDate = NICGenerator.getDOBFromNIC(icNo);
        const age = NICGenerator.getFormattedAge(icNo);
        await BaseCommandCaller.updateJsonFile(dataTable, dtColoumnNameDOB, birthDate,index);
        await BaseCommandCaller.updateJsonFile(dataTable, dtColoumnNameAge, age,index);
        const mobileNumber = await MobileNumberGenerator.generateAndUpdateJson(dtColoumnNameMobileNumber, dataTable, index);
        const { appointmentStartDateTime, appointmentEndDateTime } = generateAppointmentDateTimeForMalaysia(apoinmentTime, slotMinutes);
        // Assigning to parameters
        const startDateTimeParam = appointmentStartDateTime;
        const endDateTimeParam = appointmentEndDateTime;
        const patientName = await NameGenerator.generateAndUpdateJson(dtColoumnNameName, dataTable, index);
        const apiUrl = apiEndPoint;

        const headers = {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Regioncode': 'MYS',
            'Facilitycode': 'BRIM',
        };


        // Dynamically generate appointmentId
        const appointmentId = await BaseCommandCaller.generateAppointmentNumber();

        // Dynamically generate acknowledgementId based on appointmentId
        const acknowledgementId = `JC_Appointment_BRIM_${appointmentId}_XX`;

        const body = {
            title: "AppointmentScheduling",
            acknowledgementId: acknowledgementId,
            createdBy: "Pepadmin",
            facilityCode: "BRIM",
            appointmentId: appointmentId,
            patientMRN: "",
            firstName: patientName,
            firstNameVn: "",
            middleName: "",
            middleNameVn: "",
            familyName: "",
            icNo: icNo,
            oldIcNo: "",
            raceCode: "BH",
            dob: birthDate,
            street1: "Tets Street 1",
            street2: "Tets Street 12",
            cityCode: "KL",
            phone: mobileNumber,
            emailId: email,
            doctorCode: doctorCode,
            genderCode: "L",
            appointmentStartDateTime: startDateTimeParam,
            appointmentEndDateTime: endDateTimeParam,
            duration: apoinmentDuration,
            visitTypeDesc: "Consultation",
            chargeTypeCode: "CTC1",
            remarks: "APPOINTMENT REMARKS Automation SIT Test",
            cancellationReasonCode: "",
            uhid: "",
            passportExpiryDate: null,
            passportIssuedCountryCode: "MYS",
            nationalityCode: "MYS",
            phoneCountryCode: "MYS",
            idppidentifierType: "IT001",
            statusCode: "OPE",
            minervaStatus: "booked",
            isDeleted: false,
            regionCode: "MYS",
        };
        

        const expectedResponseKeys = {
            message: "Data Added Successfully.",
            statusCode: "200",
            isSuccess: true,
        };

        // Create a request context
        const requestContext = await request.newContext();
        console.log('Request Context:', body);
        // Use the API wrapper command
        const response = await ApiUtils.sendRequest({
            requestContext,
            method: 'POST',
            url: apiUrl,
            headers,
            body,
            expectedStatusCode: 200,
            expectedResponseKeys,
        });

        console.log('Acknowledgement ID:', acknowledgementId); // Log the dynamic acknowledgementId
        console.log('Appointment ID:', response.result); // Log the returned appointment ID
        return { icNo, appointmentId, patientName, birthDate, mobileNumber,age};
    }

    static async bc_GetBareerToken(page: Page) {
                // Extract the token
        const tokenKey = 'appointmentToken';

        try {
            const token = await BrowserTokenHelper.extractToken(page, tokenKey);

            if (token) {
            console.log(`[SUCCESS] Extracted Token: ${token}`);
            // Use or save the token as needed
            } else {
            console.error(`[FAILURE] Token not found.`);
            
            }
            return token;
            } catch (error) {
                console.error(`[ERROR] Error during token extraction: ${error}`);
            }
    }
}