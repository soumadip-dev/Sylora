import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT);

export const env: { PORT: number; MONGO_URI: string } = {
  PORT: Number.isNaN(port) ? 8080 : port,
  MONGO_URI: String(process.env.MONGO_URI),
};
