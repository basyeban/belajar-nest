import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';

let expressAppInstance: any;

// Serverless Handler untuk Vercel Deployment
export default async function handler(req: any, res: any) {
  if (!expressAppInstance) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );
    await app.init();
    expressAppInstance = app.getHttpAdapter().getInstance();
  }
  return expressAppInstance(req, res);
}

// Standalone Server untuk Localhost / Docker / Render
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Aktifkan CORS agar frontend Next.js dapat mengakses API
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe untuk DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🚀 CelenganKu API Server is running on: http://localhost:${port}`);
  logger.log(`📋 Available Endpoints:`);
  logger.log(`   - POST   /api/auth/login       (Login tanpa password hash)`);
  logger.log(`   - POST   /api/auth/register    (Register akun baru)`);
  logger.log(`   - GET    /api/dashboard/stats`);
  logger.log(`   - POST   /api/dashboard/reset`);
  logger.log(`   - GET    /api/goals`);
  logger.log(`   - POST   /api/goals`);
  logger.log(`   - GET    /api/goals/:id`);
  logger.log(`   - PUT    /api/goals/:id        (Edit target tabungan)`);
  logger.log(`   - DELETE /api/goals/:id`);
  logger.log(`   - GET    /api/transactions`);
  logger.log(`   - POST   /api/transactions`);
  logger.log(`=======================================================`);
}

// Jalankan listener mandiri jika tidak di lingkungan Vercel serverless
if (!process.env.VERCEL) {
  await bootstrap();
}
