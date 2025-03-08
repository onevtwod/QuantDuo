/**
 * Colors for QuantDuo - Gamified Learning Platform for Quantitative Traders
 * Using a professional finance/trading color scheme with green and blue accents
 */

const primaryGreen = '#00C853';  // Success, profit, positive trends
const primaryBlue = '#0052CC';   // Primary brand color
const accentOrange = '#FF9800';  // Warnings, alerts
const accentRed = '#FF3D00';     // Errors, losses, negative trends

export const Colors = {
  light: {
    text: '#1A2138',             // Dark blue-gray for text
    background: '#FFFFFF',
    tint: primaryBlue,
    icon: '#5E6C84',
    tabIconDefault: '#5E6C84',
    tabIconSelected: primaryBlue,
    card: '#F4F5F7',
    border: '#DFE1E6',
    profit: primaryGreen,
    loss: accentRed,
    warning: accentOrange,
    neutral: '#78909C',
    chart: {
      grid: '#E0E0E0',
      line: primaryBlue,
      area: 'rgba(0, 82, 204, 0.1)',
    }
  },
  dark: {
    text: '#E9EBEE',
    background: '#0F1724',       // Dark blue-black background
    tint: '#4C9AFF',             // Lighter blue for dark mode
    icon: '#A6B1C2',
    tabIconDefault: '#A6B1C2',
    tabIconSelected: '#4C9AFF',
    card: '#1C2331',
    border: '#2C3545',
    profit: '#00E676',           // Brighter green for dark mode
    loss: '#FF5252',             // Brighter red for dark mode
    warning: '#FFAB40',          // Brighter orange for dark mode
    neutral: '#90A4AE',
    chart: {
      grid: '#2C3545',
      line: '#4C9AFF',
      area: 'rgba(76, 154, 255, 0.15)',
    }
  },
};
