import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Vue dev 서버
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // 쿠키/세션 쓰면 true로 바꾸고 아래도 함께 적용
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
