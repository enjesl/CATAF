// LIB_Common.ts

import { Page, expect  } from '@playwright/test';
import { BaseCommandCaller as BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';  // Import Playwright wrapper methods
import { getLocatorWithDynamicValue, locators , PG_MicrosoftLogin_Locators, resolveLocator} from '../Runtime/Helpers/LocatorHelper';  // Import locators from LocatorHelper
import test, { after } from 'node:test';

export class LIB_Common {
    
 
  static async bc_OpenUrl(page: Page, url: string, expected_url: string) {
    await page.goto(url); 
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(expected_url);  
  }


  static async bc_IsLogged(page: Page) {
    const isLogged = await BaseCommandCaller.isLocatorPresent(page, 'PG_Common.link_opennav', 3000, 'soft'); 
    return isLogged;
  }
  
  static async bc_Login(page: Page, country: string, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_Login.label_country',wait, 'soft' );
    await BaseCommandCaller.click(page,'PG_Login.input_countrydropdown');
    const select_dropdownvalue_locatorKey = 'PG_Login_Locators.select_dropdownvalue';
    const select_dropdownvalue = resolveLocator(select_dropdownvalue_locatorKey);
    const updatedLocator = getLocatorWithDynamicValue(select_dropdownvalue, '{countryName}', country);
    await BaseCommandCaller.isLocatorPresent(page,updatedLocator,wait, 'soft');
    await BaseCommandCaller.click(page, updatedLocator)
    await BaseCommandCaller.isLocatorPresent(page,'PG_Login.button_login',wait, 'soft');
    await BaseCommandCaller.assertButtonVisibility(page, 'PG_Login.button_login',wait,true);
    await BaseCommandCaller.click(page,'PG_Login.button_login')
  }

  static async bc_MicrosoftLogin(page: Page, email: string, password: string, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_MicrosoftLogin.label_signin',wait, 'hard' );
    await BaseCommandCaller.fill(page, 'PG_MicrosoftLogin.input_email', email);
    await BaseCommandCaller.click(page, 'PG_MicrosoftLogin.button_next');
    await BaseCommandCaller.isLocatorPresent(page, 'PG_MicrosoftLogin.label_enterpassword', wait, 'hard');
    await BaseCommandCaller.fill(page, 'PG_MicrosoftLogin.input_password',password);
    await BaseCommandCaller.click(page, 'PG_MicrosoftLogin.button_signin');
    await BaseCommandCaller.captureScreenshotWithTitle(page, 'After The Perform the Sign In Button Click')
    
  }

static async bc_ProceedWelcome(page: Page, welcomemessage: string, welcome_url: string,
country: string, hospital: string, department: string, wait: number) {
    // Check if the button_loginhere is available
const buttonLocatorFound = await BaseCommandCaller.isLocatorPresent(page, 'PG_Login.button_loginhere', wait, 'soft');

if (buttonLocatorFound) {
    try {
        // First attempt to click with recovery
        await BaseCommandCaller.click(page, 'PG_Login.button_loginhere', true);
        await expect(page).toHaveURL(welcome_url); 
    
    } catch (error) {
        console.log("First attempt failed, retrying recovery click...");
    
        // Retry recovery click if the previous step failed
        await BaseCommandCaller.click(page, 'PG_Login.button_loginhere', true);
        // If there’s a next action that may fail again
        try {
            // Next action
            await expect(page).toHaveURL(welcome_url); 
        } catch (secondError) {
            console.log("Second attempt also failed, recovery click will be tried again.");
            // Retry recovery click again after second failure
            await BaseCommandCaller.click(page, 'PG_Login.button_loginhere', true);
        }
    }
} else {
    console.log("button_loginhere not found, skipping login attempt.");
    await expect(page).toHaveURL(welcome_url); 
}

    await BaseCommandCaller.isLocatorPresent(page, 'PG_Welcome.header_welcome',wait, 'hard' );
    await BaseCommandCaller.assertTextMatch(page, 'PG_Welcome.header_welcome', welcomemessage);
    await BaseCommandCaller.assertTextMatch(page, 'PG_Welcome.header_country', country, true);
    await BaseCommandCaller.selectOption(page, 'PG_Welcome.select_hospital', hospital);
    await BaseCommandCaller.selectOption(page, 'PG_Welcome.select_department', department);
    const iagreecheckbox_checked_locatorFound = await BaseCommandCaller.isLocatorPresent(page, 'PG_Welcome.input_iagreecheckbox_checked', wait, 'soft');
    if (iagreecheckbox_checked_locatorFound) {
        console.log("Locator is present, proceeding to click");
        await BaseCommandCaller.captureScreenshotWithTitle(page,'I Agree Check Boxs are Checked')
      } else {
        await BaseCommandCaller.isLocatorPresent(page, 'PG_Welcome.input_iagreecheckbox', wait, 'hard');
        await BaseCommandCaller.click(page, 'PG_Welcome.input_iagreecheckbox', true);
      }

    await LIB_Common.bc_HandelClickOnSkipTourPopUp(page,wait);
    await BaseCommandCaller.click(page, 'PG_Welcome.button_submit');
    await BaseCommandCaller.assertTextMatch(page, 'PG_Welcome.header_hospital', hospital+' '+'(' +department+ ')');     
  }

  static async bc_HandelClickOnMenu(page: Page, mainnavigationlinkname: string, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_Common.link_opennav', wait, 'hard');
    await BaseCommandCaller.click(page, 'PG_Common.link_opennav', true);
    await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
    const navigation_link_locator = 'PG_Common_Locators.link_anynavigationtext';
    const resolving_navigation_link_locator = resolveLocator(navigation_link_locator);
    const resolved_navigation_link_locator = getLocatorWithDynamicValue(resolving_navigation_link_locator,'{navigationLinkName}', mainnavigationlinkname);
    console.log(resolved_navigation_link_locator);
    await BaseCommandCaller.isLocatorPresent(page,resolved_navigation_link_locator,wait, 'hard');
    await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT')
    
  }

  static async bc_HandelMainNavigationLinkClick(page: Page, mainnavigationlinkname: string, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_Common.link_opennav', wait, 'hard');
    await BaseCommandCaller.click(page, 'PG_Common.link_opennav', true);
    await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
    const navigation_link_locator = 'PG_Common_Locators.link_anynavigationtext';
    const resolving_navigation_link_locator = resolveLocator(navigation_link_locator);
    const resolved_navigation_link_locator = getLocatorWithDynamicValue(resolving_navigation_link_locator,'{navigationLinkName}', mainnavigationlinkname);
    console.log(resolved_navigation_link_locator);
    await BaseCommandCaller.isLocatorPresent(page,resolved_navigation_link_locator,wait, 'hard');
    await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
    await BaseCommandCaller.click(page,resolved_navigation_link_locator, true);
    
  }

  static async bc_HandelSubNavigationLinkClick(page: Page, subnavigationlinkname: string, wait: number) {

    const navigation_link_locator = 'PG_Common_Locators.link_anynavigationtext';
    const resolving_navigation_link_locator = resolveLocator(navigation_link_locator);
    const resolved_navigation_link_locator = getLocatorWithDynamicValue(resolving_navigation_link_locator,'{navigationLinkName}', subnavigationlinkname);
    await BaseCommandCaller.isLocatorPresent(page,resolved_navigation_link_locator,wait, 'hard');
    await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
    await BaseCommandCaller.click(page,resolved_navigation_link_locator, true);
    
  }
  
  static async bc_LogOut(page: Page, wait: number = 3000) {

    await BaseCommandCaller.isLocatorPresent(page,'PG_Common.link_logouttogal',wait, 'hard');
    await BaseCommandCaller.click(page,'PG_Common.link_logouttogal', true);
    await BaseCommandCaller.isLocatorPresent(page,'PG_Common.link_logout',wait, 'hard');
    await BaseCommandCaller.click(page,'PG_Common.link_logout', true);
    await BaseCommandCaller.isLocatorPresent(page, 'PG_Login.label_country',wait, 'soft');
  }

  static async bc_ResolveParameterSpanandPerformArrowDown(page: Page, locatortKey: string, parameterValue: string,
     wait: number) {

    const parameter_locator = locatortKey;
    const resolving_parameter_locator = resolveLocator(parameter_locator);
    const resolved_parameter_locator = getLocatorWithDynamicValue(resolving_parameter_locator,'{parameter}', parameterValue);
    await await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
    await BaseCommandCaller.arrowDown(page, resolved_parameter_locator);
    await await BaseCommandCaller.hardPause(page,wait,true,'Unstable in SIT');
    await BaseCommandCaller.enter(page, resolved_parameter_locator);
    
  }
  

  static async bc_ResolveParameter(page: Page, locatortKey: string, parameterValue: string, wait: number) {
    const parameter_locator = locatortKey;
    const resolving_parameter_locator = resolveLocator(parameter_locator);
    const resolved_parameter_locator = getLocatorWithDynamicValue(resolving_parameter_locator,'{parameter}', parameterValue);
    await BaseCommandCaller.enter(page, resolved_parameter_locator);
  }

  static async bc_HandelClickOnNavigationCancelButton(page: Page, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page,'PG_Common.button_cancelnav',wait,'soft');
    await BaseCommandCaller.click(page, 'PG_Common.button_cancelnav');
    await BaseCommandCaller.isLocatorPresent(page, 'PG_RequestForAdmission.label_cancelationconfirmation', wait,'hard');
    await BaseCommandCaller.click(page, 'PG_RequestForAdmission.button_okcancelationconfirmation');
  }

  static async bc_HandelClickOnSkipTourPopUp(page: Page, wait: number) {
    await BaseCommandCaller.hardPause(page, wait);
    const isFrame = await BaseCommandCaller.isLocatorPresent(page,'PG_Common.iframe_popupskip',wait,'soft');
    if(isFrame){
      await BaseCommandCaller.clickInsideIframe(page,'PG_Common.iframe_popupskip', 'PG_Common.button_skiptour');
    }
  }

  static async bc_HandelClickOnNavEditButton(page: Page, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page,'PG_Common.button_edittopnav',wait,'hard');
    await BaseCommandCaller.click(page, 'PG_Common.button_edittopnav');
    await BaseCommandCaller.isLocatorPresent(page, 'PG_Common.button_edittopnavdisabled',wait,'hard');
  }

  static async bc_HandelClickOnNavSaveButton(page: Page, wait: number) {
    await BaseCommandCaller.isLocatorPresent(page,'PG_Common.button_savetopnav',wait,'hard');
    await BaseCommandCaller.click(page, 'PG_Common.button_savetopnav');
    await BaseCommandCaller.hardPause(page,wait);
  }

}