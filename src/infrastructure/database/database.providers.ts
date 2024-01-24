import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const getDataSourceProperties = (
  config: ConfigService,
): DataSourceOptions => {
  return {
    type: 'postgres',
    host: config.getOrThrow('DB_HOST'),
    port: Number(config.getOrThrow('DB_PORT')),
    username: config.getOrThrow('DB_USERNAME'),
    password: config.getOrThrow('DB_PASSWORD'),
    database: config.getOrThrow('DB_NAME'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: config.get('NODE_ENV') === 'production',
  };
};

export const getTestDataSourceProperties = (
  config: ConfigService,
): DataSourceOptions => {
  return {
    type: 'postgres',
    host: config.getOrThrow('DB_HOST'),
    port: Number(config.getOrThrow('DB_PORT')),
    username: config.getOrThrow('DB_USERNAME'),
    password: config.getOrThrow('DB_PASSWORD'),
    database: 'e2e_test',
    entities: ['../**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: false,
  };
};

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory:
      process.env.NODE_ENV === 'test'
        ? async (config) => {
            const dataSource = new DataSource(
              getTestDataSourceProperties(config),
            );
            return dataSource.initialize();
          }
        : async (config: ConfigService) => {
            const dataSource = new DataSource(getDataSourceProperties(config));
            return dataSource.initialize();
          },
  },
];
