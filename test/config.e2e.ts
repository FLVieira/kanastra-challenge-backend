import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { createDatabase, dropDatabase } from 'typeorm-extension';
import { getTestDataSourceProperties } from '../src/infrastructure/database/database.providers';

export async function createTestDataSource(dbOptions: DataSourceOptions) {
  const dataSource = new DataSource(dbOptions);
  await dataSource.initialize();
  return dataSource;
}

export class TestDBInitiator {
  private readonly initialDatabase: string;
  readonly dbOptions: DataSourceOptions;
  readonly configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
    const config = getTestDataSourceProperties(this.configService);
    this.dbOptions = config;
  }

  async createDatabase() {
    await this.dropDatabase();
    console.log(`Creating test database '${this.dbOptions.database}'`);
    await createDatabase({
      options: this.dbOptions,
      initialDatabase: this.initialDatabase,
      ifNotExist: false,
    });
    const dataSource = await createTestDataSource(this.dbOptions);

    console.log('Running migrations');
    dataSource.runMigrations({ transaction: 'all' });
    await dataSource.destroy();

    console.log('✓ Done. Test database is ready to accept connections ✓\n');
  }

  async dropDatabase(dropAll = false) {
    console.log(`Dropping test database '${this.dbOptions.database}'`);
    if (dropAll) {
      const dataSource = await createTestDataSource(this.dbOptions);
      await dataSource.query(
        `SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${this.dbOptions.database}';`,
      );
    }
    await dropDatabase({
      options: this.dbOptions,
      initialDatabase: this.initialDatabase,
    });
  }
}
