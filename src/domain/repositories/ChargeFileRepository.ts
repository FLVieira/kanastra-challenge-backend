import { ChargeFile } from '../entities/ChargeFile';

export interface ChargeFileRepository {
  findAll(): Promise<ChargeFile[]>;
  saveChargeFile(data: Express.Multer.File): Promise<ChargeFile>;
}
