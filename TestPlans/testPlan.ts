import { spawn } from 'child_process';
import * as path from 'path';

// Define test cases in strict execution order
const testCases = [
  "427 - .*",
  "1118 -  *",
  "RFA - .*",
  "241 -  .*",
  "485 -  .*"
];

// Resolve the full path to `npx`
const npxPath = path.resolve(process.env['APPDATA'] || '', 'npm', 'npx.cmd');

// Function to execute commands and stream output
function runCommandWithStreaming(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit', shell: true });
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command} ${args.join(' ')}" failed with code ${code}`));
      }
    });
  });
}

// Main function to execute the test plan in sequence
async function runTestPlan() {
  console.log('--- Starting Test Plan Execution in Sequence ---');

  const totalTests = testCases.length;
  let passedTests = 0;
  let failedTests = 0;

  console.log(`Total test cases to execute in order: ${totalTests}\n`);

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      console.log(`Executing test case ${i + 1}/${totalTests}: "${testCase}"`);
      await runCommandWithStreaming(npxPath, ['playwright', 'test', '-g', testCase]);
      console.log(`Test case "${testCase}" executed successfully.`);
      passedTests++;
    } catch (error) {
      const err = error as Error;
      console.error(`Test case "${testCase}" failed: ${err.message}`);
      failedTests++;
    }
  }

  // Generate the Allure report
  try {
    console.log('\nGenerating Allure report...');
    await runCommandWithStreaming(npxPath, ['allure', 'generate', './allure-results', '--clean']);
    console.log('Allure report generated successfully.');
  } catch (error) {
    const err = error as Error;
    console.error('Failed to generate Allure report:', err.message);
  }

  // Open the Allure report
  try {
    console.log('Opening Allure report...');
    await runCommandWithStreaming(npxPath, ['allure', 'open', './allure-report']);
  } catch (error) {
    const err = error as Error;
    console.error('Failed to open Allure report:', err.message);
  }

  // Display a summary of the results
  console.log('\n--- Test Plan Execution Summary ---');
  console.log(`Total test cases: ${totalTests}`);
  console.log(`Passed test cases: ${passedTests}`);
  console.log(`Failed test cases: ${failedTests}`);
  console.log('--- Test Plan Execution Completed ---');
}

// Execute the test plan
runTestPlan();
