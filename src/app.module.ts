import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';

import { DogsModule } from './dogs/dogs.module';
import { PlacesModule } from './places/places.module';
import { PlaceHistoriesModule } from './place-histories/placeHistories.module';

import { DogPostsModule } from './dog-posts/dogPosts.module';
import { WalkHistoriesModule } from './walk-histories/walkHistories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DogsModule,
    PlacesModule,
    PlaceHistoriesModule,
    DogPostsModule,
    WalkHistoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
