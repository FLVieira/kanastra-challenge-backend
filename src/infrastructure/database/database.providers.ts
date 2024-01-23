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

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource(getDataSourceProperties(config));
      return dataSource.initialize();
    },
  },
];
