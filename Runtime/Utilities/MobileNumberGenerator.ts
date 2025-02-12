import * as fs from 'fs';
import * as path from 'path';

export class MobileNumberGenerator {
  private static usedNumbers: Set<string> = new Set();

  /**
   * Generates a unique mobile number, updates the specified JSON file at a given index, and returns the mobile number.
   *
   * @param keyName - The key in the JSON object to update (e.g., "mobileNumber").
   * @param jsonFileName - The name of the JSON file to update (without extension).
   * @param iterationIndex - The index of the object in the JSON array to update.
   * @param outputDir - The directory containing the JSON file.
   * @returns The generated mobile number.
   */
  static async generateAndUpdateJson(
    keyName: string,
    jsonFileName: string,
    iterationIndex: number,
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

      // Ensure the iteration index is valid
      if (iterationIndex < 0 || iterationIndex >= jsonData.length) {
        throw new Error(`Invalid iteration index: ${iterationIndex}`);
      }

      // Generate the mobile number
      const mobileNumber = this.generateUniqueMobileNumber();
      jsonData[iterationIndex][keyName] = mobileNumber;

      console.log(`Updated object at index ${iterationIndex}:`, JSON.stringify(jsonData[iterationIndex], null, 2));

      // Save the updated JSON back to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`JSON file updated successfully: ${filePath}`);

      return mobileNumber;
    } catch (error) {
      console.error(`Error in generateAndUpdateJson: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Generates a unique mobile number with a maximum length of 10 digits.
   *
   * @returns The generated mobile number.
   */
  private static generateUniqueMobileNumber(): string {
    const maxLength = 10; // Maximum length of the mobile number
    const prefix = '07'; // Example prefix for mobile numbers
    const remainingLength = maxLength - prefix.length; // Remaining digits to generate
    const randomDigits = this.generateRandomDigits(remainingLength); // Generate remaining digits
    const mobileNumber = `${prefix}${randomDigits}`;

    // Ensure uniqueness of the number
    if (this.usedNumbers.has(mobileNumber)) {
      console.log(`Duplicate number detected: ${mobileNumber}. Generating a new one.`);
      return this.generateUniqueMobileNumber();
    }
    this.usedNumbers.add(mobileNumber);

    console.log(`Generated unique mobile number: ${mobileNumber}`);
    return mobileNumber;
  }

  /**
   * Generates a random sequence of digits of the specified length.
   *
   * @param length - The number of random digits to generate.
   * @returns The generated random digits as a string.
   */
  private static generateRandomDigits(length: number): string {
    let digits = '';
    for (let i = 0; i < length; i++) {
      digits += Math.floor(Math.random() * 10); // Random digit between 0 and 9
    }
    return digits;
  }
}
