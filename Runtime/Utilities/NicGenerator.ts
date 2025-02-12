import * as fs from 'fs';
import * as path from 'path';

export class NICGenerator {
  /**
   * Generates and updates NIC in a JSON file.
   * @param gender Gender for the NIC ('male' or 'female').
   * @param keyName The key in the JSON object to update with the generated NIC.
   * @param jsonFileName The JSON file to update (without extension).
   * @param index The index of the JSON object to update.
   * @param nicType The type of NIC ('MyKAD' or 'MyKID').
   * @param outputDir Directory where the JSON file is located.
   * @returns Generated NIC.
   */
  static async generateAndUpdateNIC(
    gender: string,
    keyName: string,
    jsonFileName: string,
    index: number,
    nicType: string,
    outputDir: string = './DataTables/StaticDataTables'
  ): Promise<string> {
    try {
      const filePath = path.join(outputDir, `${jsonFileName}.json`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`JSON file not found at path: ${filePath}`);
      }

      console.log(`Reading JSON file: ${filePath}`);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      if (index < 0 || index >= jsonData.length) {
        throw new Error(`Invalid index: ${index}. Must be between 0 and ${jsonData.length - 1}`);
      }

      const nicNumber = this.generateRandomNIC(gender.toLowerCase().trim(), nicType.toLowerCase().trim());
      jsonData[index][keyName] = nicNumber;

      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      return nicNumber;
    } catch (error) {
      console.error(`Error in generateAndUpdateNIC: ${error}`);
      throw error;
    }
  }

  static generateRandomNIC(gender: string, nicType: string): string {
    const generationDate = new Date();
    let minDate: Date;
    let maxDate: Date;

    if (nicType.toLowerCase() === 'mykad') {
      // Generate a date range for ages 18 and above
      maxDate = new Date(generationDate.getFullYear() - 18, generationDate.getMonth(), generationDate.getDate());
      minDate = new Date(1940, 0, 1); // Assuming no MyKAD issued before 1940
    } else if (nicType.toLowerCase() === 'mykid') {
      // Generate a date range for ages below 12
      maxDate = new Date(generationDate.getFullYear() - 12, generationDate.getMonth(), generationDate.getDate());
      minDate = new Date(1940, 0, 1);
    } else {
      throw new Error(`Invalid NIC type: ${nicType}`);
    }

    const randomDate = this.generateRandomDate(minDate, maxDate);
    const formattedDate = this.formatDateToYYMMDD(randomDate);

    // Generate middle digits (XX) - geographic code or random
    const middleDigits = this.getRandomInt(10, 99).toString().padStart(2, '0');

    // Generate the last 4 digits based on gender
    const lastFourDigits = this.generateLastFourDigits(gender);

    return `${formattedDate}-${middleDigits}-${lastFourDigits}`;
  }

  private static generateRandomDate(start: Date, end: Date): Date {
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime);
  }

  private static formatDateToYYMMDD(date: Date): string {
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static generateLastFourDigits(gender: string): string {
    const randomDigits = this.getRandomInt(0, 999).toString().padStart(3, '0');
    const lastDigit = gender.toLowerCase() === 'male' ? this.getRandomOddDigit() : this.getRandomEvenDigit();
    return `${randomDigits}${lastDigit}`;
  }

  private static getRandomOddDigit(): number {
    const oddDigits = [1, 3, 7, 9];
    return oddDigits[Math.floor(Math.random() * oddDigits.length)];
  }

  private static getRandomEvenDigit(): number {
    const evenDigits = [2, 4, 6, 8];
    return evenDigits[Math.floor(Math.random() * evenDigits.length)];
  }

  /**
 * Extracts Date of Birth (DOB) from NIC and formats it to ISO format with a time component.
 */
static getDOBFromNIC(nic: string): string {
  const [year, month, day] = [nic.slice(0, 2), nic.slice(2, 4), nic.slice(4, 6)];
  const fullYear = parseInt(year) > 30 ? `19${year}` : `20${year}`; // Adjust for 1900s and 2000s
  const dob = new Date(`${fullYear}-${month}-${day}T16:00:00.000Z`);
  return dob.toISOString(); // Ensure the format matches ISO 8601
}

/**
 * Calculates the age in "YYM DD" format from the given NIC.
 */
static getFormattedAge(nic: string): string {
  const dob = new Date(this.getDOBFromNIC(nic));
  const today = new Date();

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of the previous month
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years}Y ${months}M ${days}D`;
}

}

/**
 * Updates the middle and last parts of a NIC while keeping the first 6 digits (DOB) unchanged.
 * The middle and last parts are generated randomly.
 * @param nic The original NIC in the format 'YYMMDD-XX-XXXX'.
 * @returns The updated NIC with the same first 6 digits and randomly generated middle/last digits.
 * @throws Error if the NIC format is invalid.
 */
export function generateTwinNic(nicInput: string): string {
  // Validate NIC format
  const nicPattern = /^\d{6}-\d{2}-\d{4}$/;
  if (!nicPattern.test(nicInput)) {
    throw new Error('Invalid NIC format. Expected format: YYMMDD-XX-XXXX');
  }

  // Extract the first 6 digits (DOB)
  const firstSixDigits = nicInput.slice(0, 6);

  // Generate random middle two digits (e.g., '67')
  const randomMiddleDigits = Math.floor(Math.random() * 90 + 10).toString(); // Random number between 10 and 99

  // Generate random last four digits (e.g., '7890')
  const randomLastFourDigits = Math.floor(Math.random() * 9000 + 1000).toString(); // Random number between 1000 and 9999

  // Construct the updated NIC
  const updatedNIC = `${firstSixDigits}-${randomMiddleDigits}-${randomLastFourDigits}`;

  return updatedNIC;
}