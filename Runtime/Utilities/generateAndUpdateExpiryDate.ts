import * as fs from 'fs';
import * as path from 'path';

export class PassportExpiryGenerator {
  /**
   * Generates and updates passport expiry date in a JSON file.
   * @param keyName The key in the JSON object to update with the generated expiry date.
   * @param jsonFileName The JSON file to update (without extension).
   * @param index The index of the JSON object to update.
   * @param outputDir Directory where the JSON file is located.
   * @returns Generated passport expiry date in dd/mm/yyyy format.
   */
  static async generateAndUpdateExpiryDate(
    keyName: string,
    jsonFileName: string,
    index: number,
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

      console.log('Original JSON data:', JSON.stringify(jsonData, null, 2));

      // Ensure the index is valid
      if (index < 0 || index >= jsonData.length) {
        throw new Error(`Invalid index: ${index}. Must be between 0 and ${jsonData.length - 1}`);
      }

      // Generate the expiry date
      const expiryDate = this.generateExpiryDate();
      jsonData[index][keyName] = expiryDate; // Update the JSON object

      console.log(`Updated object at index ${index}:`, JSON.stringify(jsonData[index]));

      // Save the updated JSON back to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`JSON file updated successfully: ${filePath}`);

      return expiryDate; // Return the generated expiry date
    } catch (error) {
      console.error(`Error in generateAndUpdateExpiryDate: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Generates a random expiry date in the range of 6 months to 10 years from now.
   * @returns Expiry date in dd/mm/yyyy format.
   */
  static generateExpiryDate(): string {
    const today = new Date();
    const minDate = new Date(today); // Minimum is 6 months from today
    minDate.setMonth(today.getMonth() + 6);

    const maxDate = new Date(today); // Maximum is 10 years from today
    maxDate.setFullYear(today.getFullYear() + 10);

    const randomDate = this.generateRandomDate(minDate, maxDate);
    return this.formatDateToDDMMYYYY(randomDate);
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
