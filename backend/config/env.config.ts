import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3000'),
  GROQ: {
    API_KEY: process.env.GROQ_API_KEY || '',
    MODEL_NAME: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    TEMPERATURE: parseFloat(process.env.GROQ_TEMPERATURE || '0.7'),
    MAX_TOKENS: parseInt(process.env.GROQ_MAX_TOKENS || '300'),
  },
};
