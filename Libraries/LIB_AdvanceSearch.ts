// LIB_AdvanceSearch.ts

import { Page, expect  } from '@playwright/test';
import { BaseCommandCaller as BaseCommandCaller } from '../Runtime/Helpers/BaseCommands';  // Import Playwright wrapper methods
import { getLocatorWithDynamicValue, locators , PG_MicrosoftLogin_Locators, resolveLocator} from '../Runtime/Helpers/LocatorHelper';  // Import locators from LocatorHelper


export class LIB_AdvanceSearch {
      
  static async bc_SearchByIcNo(page: Page,nicNo: string, wait: number) {

    await BaseCommandCaller.isLocatorPresent(page, 'PG_MrnSearch.input_uidno',wait, 'soft' );
    await BaseCommandCaller.clearTextField(page,'PG_MrnSearch.input_icno');
    await BaseCommandCaller.fill(page,'PG_MrnSearch.input_icno', nicNo)
    await BaseCommandCaller.click(page,'PG_MrnSearch.button_search');
    const indexcount = await BaseCommandCaller.getAllIndices(page,'PG_MrnSearch.rows_searchresults');
    
  }

  
}