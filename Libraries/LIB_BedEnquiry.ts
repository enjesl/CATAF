// LIB_BedEnquiry.ts

import { Page, expect  } from '@playwright/test';
import { BaseCommandCaller as BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';  // Import Playwright wrapper methods
import { getLocatorWithDynamicValue, locators , PG_MicrosoftLogin_Locators, resolveLocator} from '../Runtime/Helpers/LocatorHelper';  // Import locators from LocatorHelper


export class LIB_BedEnquiry {
    
static async bc_GetVacantBeds(page: Page, wardType: string,dataTable: string, index: number, wait: number= 3000) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_BedEnquiry.link_filter',wait, 'soft' );
    await BaseCommandCaller.click(page,'PG_BedEnquiry.link_filter');
    await BaseCommandCaller.hardPause(page,wait);
    await BaseCommandCaller.click(page, 'PG_BedEnquiry.button_wardtype');
    await BaseCommandCaller.hardPause(page,wait);
    const parameter_locator = 'PG_BedEnquiry_Locators.check_wardtype';
    const resolving_parameter_locator = resolveLocator(parameter_locator);
    const resolved_parameter_locator = getLocatorWithDynamicValue(resolving_parameter_locator,'{wardType}', wardType);
    await BaseCommandCaller.click(page, resolved_parameter_locator);
    await BaseCommandCaller.hardPause(page,wait);
    await BaseCommandCaller.isLocatorPresent(page,'PG_BedEnquiry.button_search', wait);
    await BaseCommandCaller.click(page, 'PG_BedEnquiry.button_search');
    await BaseCommandCaller.hardPause(page,wait);
    await BaseCommandCaller.isLocatorPresent(page,'PG_BedEnquiry.td_vacant',wait,'hard');
    await BaseCommandCaller.storeDataFromLocatorToJson(page, 'PG_BedEnquiry.td_bedtype', dataTable, 'bedType', index);
}



}