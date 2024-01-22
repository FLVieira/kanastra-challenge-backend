import { DataSource } from 'typeorm';
import { Charge } from '../entities/Charge.entity';
import { ChargeFile } from '../entities/ChargeFile.entity';
import { ChargeFileRepositoryImpl } from '../repositories/ChargeFileRepositoryImpl';
import { ChargeRepositoryImpl } from '../repositories/ChargeRepositoryImpl';

export const chargesProviders = [
  {
    provide: 'ChargeFileRepository',
    useFactory: (dataSource: DataSource) => {
      const repository = dataSource.getRepository(ChargeFile);
      return new ChargeFileRepositoryImpl(repository);
    },
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ChargeRepository',
    useFactory: (dataSource: DataSource) => {
      const repository = dataSource.getRepository(Charge);
      return new ChargeRepositoryImpl(repository);
    },
    inject: ['DATA_SOURCE'],
  },
];
