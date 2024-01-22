import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.providers';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow('DB_HOST'),
        port: config.getOrThrow('DB_PORT'),
        username: config.getOrThrow('DB_USERNAME'),
        password: config.getOrThrow('DB_PASSWORD'),
        database: 'postgres',
        autoLoadEntities: true,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true || process.env.ENVIRONMENT === 'seed',
      }),
    }),
  ],
  providers: [...databaseProviders, TypeOrmModule],
  exports: [...databaseProviders, TypeOrmModule],
})
export class DatabaseModule {}
