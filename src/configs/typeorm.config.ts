import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'seul',
  password: 'seul',
  database: 'board-app',

  entities: [__dirname + '/../**/*.entity.{js,ts}'],

  synchronize: true,
};
