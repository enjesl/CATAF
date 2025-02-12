import * as fs from 'fs';
import * as path from 'path';

export class PassportNumberGenerator {
  /**
   * Generates and updates a passport number in a JSON file.
   * @param keyName The key in the JSON object to update with the generated passport number.
   * @param jsonFileName The JSON file to update (without extension).
   * @param index The index of the JSON object to update.
   * @param outputDir Directory where the JSON file is located.
   * @returns Generated passport number.
   */
  static async generateAndUpdatePassportNumber(
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

      // Generate the passport number
      const passportNumber = this.generateRandomPassportNumber();
      jsonData[index][keyName] = passportNumber; // Update the JSON object

      console.log(`Updated object at index ${index}:`, JSON.stringify(jsonData[index]));

      // Save the updated JSON back to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`JSON file updated successfully: ${filePath}`);

      return passportNumber; // Return the generated passport number
    } catch (error) {
      console.error(`Error in generateAndUpdatePassportNumber: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Generates a random passport number in the format LNNNNNNN.
   * @returns Generated passport number.
   */
  static generateRandomPassportNumber(): string {
    // Generate a random letter for the first character
    const letter = String.fromCharCode(this.getRandomInt(65, 90)); // A-Z

    // Generate 7 random digits
    const digits = Array.from({ length: 7 }, () => this.getRandomInt(0, 9)).join('');

    const passportNumber = `${letter}${digits}`;
    console.log(`Generated Passport Number: ${passportNumber}`);
    return passportNumber;
  }

  /**
   * Generates a random integer within a range.
   * @param min Minimum value (inclusive).
   * @param max Maximum value (inclusive).
   * @returns Random integer.
   */
  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
