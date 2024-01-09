import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const documentConfig = new DocumentBuilder()
    .setTitle('board app')
    .setDescription('board app swagger')
    .setVersion('0.0.1')
    .addTag('board')
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT);
  Logger.log(`application running on port ${process.env.SERVER_PORT}`);
}
bootstrap();
