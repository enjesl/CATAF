// Runtime/Helpers/TimeHelper.ts

// Helper function to generate current timestamp in a readable format
export const getCurrentTimestamp = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };