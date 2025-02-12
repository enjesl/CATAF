export function generateDate(
  type: string = 'future',
  days: number = 1
): string {
  // Create a new Date instance for today
  const today = new Date();

  // Validate the input type
  if (!['today', 'future', 'past'].includes(type)) {
    throw new Error("Invalid type. Use 'today', 'future', or 'past'.");
  }

  switch (type) {
    case 'today':
      // Return today's date in the format "DD/MM/YYYY"
      return formatDate(today);

    case 'future':
      // Add the specified number of days to today
      today.setDate(today.getDate() + days);
      return formatDate(today);

    case 'past':
      // Subtract the specified number of days from today
      today.setDate(today.getDate() - days);
      return formatDate(today);

    default:
      throw new Error("Invalid type. Use 'today', 'future', or 'past'.");
  }
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function generateAppointmentDateTimeForMalaysia(
  localTime: string, // Time in "HH:mm" format (e.g., "12:00")
  slotMinutes: number, // Slot duration in minutes (e.g., 10 or 15)
  daysFromToday: number = 0 // Days into the future (0 for same day)
): { appointmentStartDateTime: string; appointmentEndDateTime: string } {
  // Parse today's date and calculate the appointment date
  const now = new Date();
  const appointmentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysFromToday
  );

  // Split the local time into hours and minutes
  const [hours, minutes] = localTime.split(':').map(Number);

  // Set the appointment start time in local time (Malaysia local time = UTC+8)
  appointmentDate.setHours(hours, minutes, 0, 0);

  // Convert appointment start time to UTC
  const appointmentStartUTC = new Date(appointmentDate.getTime() - 8 * 60 * 60 * 1000);

  // Calculate the appointment end time by adding the slot duration
  const appointmentEndUTC = new Date(appointmentStartUTC.getTime() + slotMinutes * 60 * 1000);

  // Format the dates in ISO string format (e.g., "2025-01-07T05:15:00.000Z")
  return {
    appointmentStartDateTime: appointmentStartUTC.toISOString(),
    appointmentEndDateTime: appointmentEndUTC.toISOString(),
  };
}


