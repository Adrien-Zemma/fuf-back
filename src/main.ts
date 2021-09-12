import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.use(morgan('dev'))
  await app.listen(3000);

}
bootstrap();
