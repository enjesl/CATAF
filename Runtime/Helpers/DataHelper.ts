import * as fs from 'fs';
import * as path from 'path';

export class DataHelper {
  private static getFilePath(fileName: string): string {
    return path.resolve(__dirname, '../../DataTables/StaticDataTables', `${fileName}.json`);
  }

  /**
   * Loads data from a JSON file.
   * @param fileName - Name of the JSON file (without extension).
   * @returns Parsed JSON data as an array.
   */
  static loadData(fileName: string): any[] {
    try {
      const filePath = this.getFilePath(fileName);
      console.log(`Loading data from: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error loading data file: ${e}`);
      throw e;
    }
  }

  /**
   * Reloads data dynamically from the JSON file.
   * @param fileName - Name of the JSON file (without extension).
   * @returns Parsed JSON data as an array.
   */
  static reloadData(fileName: string): any[] {
    console.log(`Reloading data for file: ${fileName}`);
    return this.loadData(fileName);
  }

  /**
   * Updates a specific key in a JSON object within the file.
   * @param fileName - Name of the JSON file (without extension).
   * @param key - Key to update in the JSON object.
   * @param value - New value to set for the key.
   * @param index - Index of the JSON object in the array.
   */
  static updateData(fileName: string, key: string, value: any, index: number): void {
    try {
      const filePath = this.getFilePath(fileName);
      console.log(`Updating data in: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const data = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(data);

      // Ensure the index is valid
      if (index < 0 || index >= jsonData.length) {
        throw new Error(`Invalid index: ${index}`);
      }

      // Update the specified key with the new value
      jsonData[index][key] = value;

      // Save the updated data back to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
      console.log(`Data updated successfully at index ${index} for key "${key}".`);
    } catch (e) {
      console.error(`Error updating data file: ${e}`);
      throw e;
    }
  }

  /**
   * Saves data to the JSON file (overwrites the entire file).
   * @param fileName - Name of the JSON file (without extension).
   * @param data - New JSON data to save.
   */
  static saveData(fileName: string, data: any[]): void {
    try {
      const filePath = this.getFilePath(fileName);
      console.log(`Saving data to: ${filePath}`);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Data saved successfully to: ${filePath}`);
    } catch (e) {
      console.error(`Error saving data file: ${e}`);
      throw e;
    }
  }

  /**
   * Reads a specific key's value from the JSON file.
   * @param fileName - Name of the JSON file (without extension).
   * @param index - Index of the JSON object in the array.
   * @param key - Key to retrieve from the JSON object.
   * @returns The value of the specified key.
   */
  static getData(fileName: string, index: number, key: string): any {
    try {
      const jsonData = this.reloadData(fileName);

      // Ensure the index is valid
      if (index < 0 || index >= jsonData.length) {
        throw new Error(`Invalid index: ${index}`);
      }

      return jsonData[index][key];
    } catch (e) {
      console.error(`Error getting data from file: ${e}`);
      throw e;
    }
  }
}
