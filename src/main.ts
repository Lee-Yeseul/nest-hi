import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const serverConfig = config.get('server');
  const documentConfig = new DocumentBuilder()
    .setTitle('board app')
    .setDescription('board app swagger')
    .setVersion('0.0.1')
    .addTag('board')
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(serverConfig.port);
  Logger.log(`application running on port ${serverConfig.port}`);
}
bootstrap();
