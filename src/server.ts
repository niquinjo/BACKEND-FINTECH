import cors from 'cors';
import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import { router } from './routes';

const app = express();

const allowedOrigins: string[] = [
  'https://fintech-ia.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000'
];

app.use(express.json())
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(router);

// Adicionado o underline (_) em _req e _next para o TypeScript não reclamar
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({
      error: error.message
    })
  }

  return res.status(500).json({
    error: "Erro Interno"
  })
})

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log("Servidor ON " + PORT);
})