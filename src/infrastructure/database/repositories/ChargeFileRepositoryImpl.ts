import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChargeFile } from '../../../domain/entities/ChargeFile';
import { ChargeFileRepository } from '../../../domain/repositories/ChargeFileRepository';
import { ChargeFile as ChargeFileDb } from '../entities/ChargeFile.entity';

@Injectable()
export class ChargeFileRepositoryImpl implements ChargeFileRepository {
  constructor(
    @Inject('CHARGE_FILE_REPOSITORY')
    private readonly repository: Repository<ChargeFileDb>,
  ) {}

  async findAll(): Promise<ChargeFile[]> {
    const allFiles = await this.repository.find();

    if (!allFiles) {
      return undefined;
    }

    return allFiles.map(this.toDomain);
  }

  async saveChargeFile(data: Express.Multer.File): Promise<ChargeFile> {
    const chargeFile = this.toEntity(data);

    const savedChargeFile = await this.repository.save(chargeFile);

    return this.toDomain(savedChargeFile);
  }

  private toDomain(data: ChargeFileDb): ChargeFile {
    return {
      id: data.id,
      name: data.name,
      uploadDate: data.uploadDate,
    };
  }

  private toEntity(data: Express.Multer.File): Omit<ChargeFileDb, 'id'> {
    return {
      name: data.originalname,
      uploadDate: new Date(),
    };
  }
}
