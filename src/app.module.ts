import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';

import { DogsModule } from './dogs/dogs.module';
import { PlacesModule } from './places/places.module';
import { PlaceHistoriesModule } from './place-histories/placeHistories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DogsModule,
    PlacesModule,
    PlaceHistoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
