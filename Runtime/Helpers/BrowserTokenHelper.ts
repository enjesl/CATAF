import { Page } from 'playwright';

export class BrowserTokenHelper{
  /**
   * Extracts a token from the browser's storage (localStorage, sessionStorage, or cookies).
   * @param page - The Playwright Page instance.
   * @param tokenKey - The key under which the token is stored.
   * @returns The extracted token as a string or null if not found.
   */
  static async extractToken(page: Page, tokenKey: string): Promise<string | null> {
    console.log(`[INFO] Extracting token for key: ${tokenKey}`);
    try {
      // Check localStorage for the token
      const localStorageToken = await page.evaluate((key) => localStorage.getItem(key), tokenKey);
      if (localStorageToken) {
        console.log(`[INFO] Found token in localStorage: ${localStorageToken}`);
        return localStorageToken;
      }

      // Check sessionStorage for the token
      const sessionStorageToken = await page.evaluate((key) => sessionStorage.getItem(key), tokenKey);
      if (sessionStorageToken) {
        console.log(`[INFO] Found token in sessionStorage: ${sessionStorageToken}`);
        return sessionStorageToken;
      }

      // Optionally check cookies for the token
      const cookies = await page.context().cookies();
      const cookieToken = cookies.find((cookie) => cookie.name === tokenKey)?.value;
      if (cookieToken) {
        console.log(`[INFO] Found token in cookies: ${cookieToken}`);
        return cookieToken;
      }

      console.error(`[ERROR] Token not found for key: ${tokenKey}`);
      return null;
    } catch (error) {
      console.error(`[ERROR] Failed to extract token: ${error}`);
      throw error;
    }
  }
}
