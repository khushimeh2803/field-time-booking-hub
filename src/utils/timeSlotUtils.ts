
// Map for time slots
export const timeSlotMap: Record<string, string> = {
  "1": "08:00 - 09:00",
  "2": "09:00 - 10:00",
  "3": "10:00 - 11:00",
  "4": "11:00 - 12:00",
  "5": "12:00 - 13:00",
  "6": "13:00 - 14:00",
  "7": "14:00 - 15:00",
  "8": "15:00 - 16:00",
  "9": "16:00 - 17:00",
  "10": "17:00 - 18:00",
  "11": "18:00 - 19:00",
  "12": "19:00 - 20:00",
  "13": "20:00 - 21:00",
  "14": "21:00 - 22:00"
};

// Helper function to check if a time slot is valid (in the future)
export const isTimeSlotValid = (date: Date | null, slotId: string): boolean => {
  if (!date) return false;
  
  const today = new Date();
  const selectedDate = new Date(date);
  
  // If date is in the future, all slots are valid
  if (selectedDate.toDateString() !== today.toDateString()) {
    return selectedDate > today;
  }
  
  // For today, check if the slot's time is in the future
  const timeRange = timeSlotMap[slotId];
  if (!timeRange) return false;
  
  const slotTime = timeRange.split(" - ")[0]; // Get start time of slot
  const [hours, minutes] = slotTime.split(":");
  
  const slotDateTime = new Date(selectedDate);
  slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Add a buffer (e.g., 30 minutes) to prevent booking slots that are too close
  const bufferTime = new Date(today);
  bufferTime.setMinutes(today.getMinutes() + 30);
  
  return slotDateTime > bufferTime;
};

// Convert a range of slots to time strings
export const getTimeRangeFromSlots = (slots: string[]): { startTime: string, endTime: string } | null => {
  if (!slots || slots.length === 0) return null;
  
  const sortedSlots = [...slots].sort((a, b) => parseInt(a) - parseInt(b));
  const firstSlot = sortedSlots[0];
  const lastSlot = sortedSlots[sortedSlots.length - 1];
  
  if (!timeSlotMap[firstSlot] || !timeSlotMap[lastSlot]) return null;
  
  return {
    startTime: timeSlotMap[firstSlot].split(" - ")[0],
    endTime: timeSlotMap[lastSlot].split(" - ")[1]
  };
};

// Check if slot ranges overlap
export const doTimeRangesOverlap = (
  startTime1: string,
  endTime1: string,
  startTime2: string,
  endTime2: string
): boolean => {
  return startTime1 <= endTime2 && startTime2 <= endTime1;
};
