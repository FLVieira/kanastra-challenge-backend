import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import path from 'path';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { ChargeFile } from '../src/infrastructure/database/entities/ChargeFile.entity';
import { AppModule } from '../src/modules/app/app.module';
import { TestDBInitiator, createTestDataSource } from './config.e2e';

describe('ChargesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let databaseConfig: TestDBInitiator;
  let chargeFileRepository: Repository<ChargeFile>;

  beforeEach(async () => {
    databaseConfig = new TestDBInitiator();
    dataSource = await createTestDataSource(databaseConfig.dbOptions);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    chargeFileRepository = dataSource.getRepository(ChargeFile);
  }, 15000);

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  }, 15000);

  it('/files (GET) - List charge files', async () => {
    // Arrange
    const chargeFiles: ChargeFile[] = [
      {
        id: 1,
        name: 'Charge_1',
        uploadDate: new Date(),
      },
    ];
    await chargeFileRepository.save(chargeFiles);

    // Act and Assert
    return request(app.getHttpServer())
      .get('/charges/files')
      .expect(200)
      .then((response) => {
        expect(
          response.body.data.find(
            (chargeFile) => chargeFile.name === 'Charge_1',
          ),
        ).toBeTruthy();
      });
  }, 5000);

  it('/ (POST) - Should create charges and chargeFile', async () => {
    // Arrange
    const FIXTURES = path.resolve(__dirname, './fixtures');
    const chargeDataCsv = path.resolve(FIXTURES, 'charges-data.csv');

    // Act
    request(app.getHttpServer())
      .post('/charges')
      .attach('file', chargeDataCsv)
      .expect(200);
  }, 5000);

  it('/ (POST) - Create charges - Should return a 400 when invalid file', async () => {
    // Arrange
    const FIXTURES = path.resolve(__dirname, './fixtures');
    const invalidChargeDataCsv = path.resolve(
      FIXTURES,
      'invalid-charges-data.csv',
    );

    // Act and Assert
    request(app.getHttpServer())
      .post('/charges')
      .attach('file', invalidChargeDataCsv)
      .expect(400);
  }, 5000);
});
