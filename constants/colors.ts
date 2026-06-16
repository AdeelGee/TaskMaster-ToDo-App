export const Colors = {
  // Overall gray theme
  background: '#3A3A38',     // main app background (gray)
  surface: '#4A4A47',        // cards / headers (lighter gray)
  surfaceLight: '#5C5C58',   // input fields, chips
  border: '#5F5E5A',

  // Plain text -> white
  text: '#FFFFFF',
  textMuted: '#C7C6C2',
  textFaint: '#9A9994',

  // Accent
  accent: '#7BB3E3',
  success: '#4CAF50',
  danger: '#E24B4A',

  // Priority colors
  high: '#E24B4A',
  medium: '#EF9F27',
  low: '#4CAF50',
};

export const PRIORITY_COLORS: Record<string, string> = {
  High: Colors.high,
  Medium: Colors.medium,
  Low: Colors.low,
};

export const CATEGORY_COLORS: Record<string, string> = {
  Study: '#378ADD',
  Personal: '#D4537E',
  University: '#7F77DD',
  Work: '#1D9E75',
  Health: '#D85A30',
};
