import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //app.use(morgan('dev'))
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
