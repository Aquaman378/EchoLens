// API Configuration
export const API_CONFIG = {
  GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
  API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
};

// Color Palette
export const COLORS = {
  PRIMARY: '#007AFF',
  BACKGROUND_DARK: '#000',
  BACKGROUND_SECONDARY: '#05050A',
  BACKGROUND_TERTIARY: '#0A0A10',
  SURFACE_DARK: '#1A1A1A',
  SURFACE_DARKER: '#0D0D15',
  SURFACE_DARKEST: '#050505',
  CANVAS_BG: '#090909',
  TEXT_PRIMARY: '#FFF',
  TEXT_SECONDARY: '#EEE',
  TEXT_TERTIARY: '#888',
  TEXT_MUTED: '#444',
  BORDER: '#333',
  BORDER_LIGHT: '#1A1A2E',
  SUCCESS: '#00FF41',
  ERROR: '#FF3B30',
  ACCENT_GLOW: '#007AFF15',
};

// Error Messages
export const ERROR_MESSAGES = {
  MISSING_API_KEY: 'Configuration error: Missing API Key.',
  API_UNAVAILABLE: 'Sorry, I\'m having trouble connecting to the brain right now.',
  CHAT_ERROR: 'The AI assistant is unavailable right now.',
  NO_IMAGE: 'No image to analyze.',
  EMPTY_CANVAS: 'Import an asset before collecting.',
  AI_FAILURE: 'AI analysis failed.',
  BASE64_CONVERSION_ERROR: 'Failed to convert image to base64.',
};

// System Prompts
export const SYSTEM_PROMPTS = {
  MINI_CHAT: 'System: You are an AI assistant in the EchoLens app. Use plain text and unicode math symbols only. Never use LaTeX, \'*\'. Keep answers concise. Answer this: ',
  IMAGE_ANALYSIS: 'System: Describe this photo\'s lighting and suggest professional edits, in simple words. Use plain text and unicode math symbols only. Never use LaTeX. Answer this: ',
};
