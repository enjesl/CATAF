import * as fs from 'fs';
import * as path from 'path';

export class DOBGenerator {
  /**
   * Generates and updates date of birth and age in a JSON file.
   * @param dobKeyName The key in the JSON object to update with the generated date of birth.
   * @param ageKeyName The key in the JSON object to update with the calculated age.
   * @param jsonFileName The JSON file to update (without extension).
   * @param index The index of the JSON object to update.
   * @param outputDir Directory where the JSON file is located.
   * @param newborn If true, sets DOB to today's date.
   * @returns Generated date of birth and age as an object.
   */
  static async generateAndUpdateDOB(
    dobKeyName: string,
    ageKeyName: string,
    jsonFileName: string,
    index: number,
    newborn: boolean = false,
    outputDir: string = './DataTables/StaticDataTables',
  ): Promise<{ dob: string; age: string }> {
    try {
      const filePath = path.join(outputDir, `${jsonFileName}.json`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`JSON file not found at path: ${filePath}`);
      }

      console.log(`Reading JSON file: ${filePath}`);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      console.log('Original JSON data:', JSON.stringify(jsonData, null, 2));

      // Ensure the index is valid
      if (index < 0 || index >= jsonData.length) {
        throw new Error(`Invalid index: ${index}. Must be between 0 and ${jsonData.length - 1}`);
      }

      // Generate DOB and Age
      let dob;
      if (newborn) {
        dob = this.formatDateToDDMMYYYY(new Date());
      } else {
        dob = this.generateDOB();
      }
      const age = this.calculateAge(dob);

      // Update JSON object
      jsonData[index][dobKeyName] = dob;
      jsonData[index][ageKeyName] = age;

      console.log(`Updated object at index ${index}:`, JSON.stringify(jsonData[index]));

      // Save updated JSON back to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`JSON file updated successfully: ${filePath}`);

      return { dob, age };
    } catch (error) {
      console.error(`Error in generateAndUpdateDOB: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Generates a random date of birth in the range of 18 to 65 years ago.
   * @returns Date of birth in dd/mm/yyyy format.
   */
  static generateDOB(): string {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() - 18); // Maximum age 18 years

    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - 65); // Minimum age 65 years

    const randomDate = this.generateRandomDate(minDate, maxDate);
    return this.formatDateToDDMMYYYY(randomDate);
  }

  /**
   * Calculates the age in "XXY XXM XXD" format from the given date of birth.
   * @param dob Date of birth in dd/mm/yyyy format.
   * @returns Age as a string in "XXY XXM XXD" format.
   */
  static calculateAge(dob: string): string {
    const [day, month, year] = dob.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day); // Months are zero-based

    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // Get days in previous month
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years}Y ${months}M ${days}D`;
  }

  /**
   * Generates a random date within a given range.
   * @param start Start date.
   * @param end End date.
   * @returns Random date within the range.
   */
  private static generateRandomDate(start: Date, end: Date): Date {
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime);
  }

  /**
   * Formats a date to dd/mm/yyyy format.
   * @param date Date to format.
   * @returns Formatted date as a string.
   */
  private static formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
