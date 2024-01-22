import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  databaseProviders,
  getDataSourceProperties,
} from './database.providers';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) =>
        getDataSourceProperties(config),
    }),
  ],
  providers: [...databaseProviders, TypeOrmModule],
  exports: [...databaseProviders, TypeOrmModule],
})
export class DatabaseModule {}
