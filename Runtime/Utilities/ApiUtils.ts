import { APIRequestContext, expect, test } from '@playwright/test';

export class ApiUtils {
  /**
   * Generic API request method with error handling and reporting
   * @param requestContext - Playwright APIRequestContext
   * @param method - HTTP method (GET, POST, PUT, DELETE)
   * @param url - API endpoint URL
   * @param headers - Request headers
   * @param body - Request body
   * @param expectedStatusCode - Expected HTTP status code
   * @param expectedResponseKeys - Key-value pairs to validate in the response
   */
  static async sendRequest({
    requestContext,
    method,
    url,
    headers = {},
    body = null,
    expectedStatusCode = 200,
    expectedResponseKeys = {},
  }: {
    requestContext: APIRequestContext;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    headers?: { [key: string]: string };
    body?: any;
    expectedStatusCode?: number;
    expectedResponseKeys?: { [key: string]: any };
  }) {
    const requestDetails = {
      method,
      url,
      headers,
      body,
    };

    try {
      // Log request details to the report
      test.info().attachments.push({
        name: 'API Request Details',
        contentType: 'application/json',
        body: Buffer.from(JSON.stringify(requestDetails, null, 2)),
      });

      // Send API request
      const response = await requestContext[method.toLowerCase() as 'post' | 'get' | 'put' | 'delete'](url, {
        headers,
        data: body,
      });

      // Parse response
      const statusCode = response.status();
      const jsonResponse = await response.json();

      // Attach response to the report
      test.info().attachments.push({
        name: 'API Response Details',
        contentType: 'application/json',
        body: Buffer.from(JSON.stringify(jsonResponse, null, 2)),
      });

      // Validate status code
      expect(statusCode).toBe(expectedStatusCode);

      // Validate response keys
      for (const key in expectedResponseKeys) {
        expect(jsonResponse[key]).toBe(expectedResponseKeys[key]);
      }

      // Log success
      console.log('API Request Successful:', JSON.stringify(jsonResponse, null, 2));

      return jsonResponse; // Return response for further use
    } catch (error) {
      // Log error details to the report
      test.info().attachments.push({
        name: 'API Error Details',
        contentType: 'text/plain',
        body: Buffer.from(error instanceof Error ? error.message : 'Unknown error'),
      });

      console.error('API Request Failed:', error instanceof Error ? error.message : 'Unknown error');
      throw error; // Re-throw error to fail the test
    } finally {
      console.log(`*** End of API Request *** [Date: ${new Date().toISOString()}]`);
    }
  }
}
