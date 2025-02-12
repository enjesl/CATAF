import { DataHelper } from '../Helpers/DataHelper'; // Assuming DataHelper is in the same directory

export class NameGenerator {
  private static usedNames: Set<string> = new Set();

  /**
   * Generates a unique name with the prefix "Auto", updates the specified JSON file at a given index, and returns the name.
   * @param keyName - The key in the JSON object to update (e.g., "fullName").
   * @param jsonFileName - The name of the JSON file to update (without extension).
   * @param iterationIndex - The index of the object in the JSON array to update.
   * @returns The generated name.
   */
  static async generateAndUpdateJson(
    keyName: string,
    jsonFileName: string,
    iterationIndex: number
  ): Promise<string> {
    console.log(`Generating and updating name in file: ${jsonFileName}`);

    // Reload the JSON data using DataHelper
    const jsonData = DataHelper.reloadData(jsonFileName);

    // Ensure the iteration index is valid
    if (iterationIndex < 0 || iterationIndex >= jsonData.length) {
      throw new Error(`Invalid iteration index: ${iterationIndex}`);
    }

    // Generate a unique full name with the prefix "Auto"
    const fullName = this.generateRandomNameWithAuto();

    // Update the specific key with the new name
    jsonData[iterationIndex][keyName] = fullName;

    // Save the updated data back to the JSON file using DataHelper
    DataHelper.saveData(jsonFileName, jsonData);

    console.log(`Name "${fullName}" updated successfully at index ${iterationIndex} in file: ${jsonFileName}`);

    return fullName;
  }

  /**
   * Generates a random name with the prefix "Auto" and ensures uniqueness.
   * @returns The generated full name.
   */
  private static generateRandomNameWithAuto(): string {
    const maxLength = 20; // Maximum allowed length
    const baseName = `Auto`; // Prefix
    const remainingLength = maxLength - baseName.length - 2; // Account for space and separator

    // Generate random first and last names
    const randomFirstName = this.generateSyllabicName(Math.floor(remainingLength / 2));
    const randomLastName = this.generateSyllabicName(remainingLength - randomFirstName.length);

    const fullName = `${baseName} ${randomFirstName} ${randomLastName}`;

    // Ensure uniqueness of the name
    if (this.usedNames.has(fullName)) {
      return this.generateRandomNameWithAuto();
    }
    this.usedNames.add(fullName);

    return fullName;
  }

  /**
   * Generates a name with alternating consonants and vowels.
   * @param length - The desired length of the name.
   * @returns The generated name.
   */
  private static generateSyllabicName(length: number): string {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';
    let name = '';
    let isConsonant = true;

    for (let i = 0; i < length; i++) {
      const charSet = isConsonant ? consonants : vowels;
      const randomIndex = Math.floor(Math.random() * charSet.length);
      name += charSet[randomIndex];
      isConsonant = !isConsonant; // Alternate between consonants and vowels
    }

    // Capitalize the first letter to make it feel more like a name
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
