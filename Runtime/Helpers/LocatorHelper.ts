import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

// Function to load a YAML file and return its content as a JavaScript object
export const loadYAMLFile = (filePath: string): any => {
  try {
    const resolvedPath = path.resolve(__dirname, '../../Pages/Browser', filePath);  
    const file = fs.readFileSync(resolvedPath, 'utf8');
    return yaml.load(file);  
  } catch (e) {
    console.error(`Error loading YAML file: ${e}`);
    throw e;
  }
};

// Load locators from PG_Search.yml and PG_Login.yml
export const PG_Search_Locators = loadYAMLFile('PG_Search.yml');  
export const PG_Login_Locators = loadYAMLFile('PG_Login.yml'); 
export const PG_MicrosoftLogin_Locators = loadYAMLFile('PG_MicrosoftLogin.yml');
export const PG_Welcome_Locators = loadYAMLFile('PG_Welcome.yml');
export const PG_Common_Locators = loadYAMLFile('PG_Common.yml');
export const PG_PatientRegistration_Locators = loadYAMLFile('PG_PatientRegistration.yml');
export const PG_RequestForAdmission_Locators = loadYAMLFile('PG_RequestForAdmission.yml');
export const PG_MrnSearch_Locators = loadYAMLFile('PG_MrnSearch.yml');
export const PG_BedEnquiry_Locators = loadYAMLFile('PG_BedEnquiry.yml');

// Function to replace placeholders in the locators (for dynamic values like country)
export const getLocatorWithDynamicValue = (locator: string, placeholder: string, value: string): string => {
  return locator.replace(placeholder, value);
};

// Defining an index signature for locators to allow dynamic access
interface Locators {
  [key: string]: { [key: string]: string };  
}

// Aggregating locators into one object
export const locators: Locators = {
  PG_Search_Locators,  
  PG_Login_Locators,
  PG_MicrosoftLogin_Locators,
  PG_Welcome_Locators,
  PG_Common_Locators,
  PG_PatientRegistration_Locators,
  PG_RequestForAdmission_Locators,
  PG_MrnSearch_Locators,
  PG_BedEnquiry_Locators
};

// Debugging: Log the locators object to confirm it's being loaded
// console.log('Loaded Locators:', locators);

export const resolveLocator = (locatorKey: string): string => {
  // Split the locatorKey into page name and locator
  const [pageName, locator] = locatorKey.split('.');  
  
  // Access the locator dynamically using the correct path in the 'locators' object
  const locatorValue = locators[`${pageName}`]?.[locator];

  // If the locator is not found, throw an error
  if (!locatorValue) {
    throw new Error(`Locator for ${locatorKey} not found.`);
  }

  return locatorValue;  // Return the resolved locator
};

