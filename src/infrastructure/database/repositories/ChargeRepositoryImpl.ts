import { Inject, Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { Charge } from '../../../domain/entities/Charge';
import { ChargeRepository } from '../../../domain/repositories/ChargeRepository';
import { Charge as ChargeDb } from '../entities/Charge.entity';

@Injectable()
export class ChargeRepositoryImpl implements ChargeRepository {
  constructor(
    @Inject('CHARGE_REPOSITORY')
    private readonly repository: Repository<ChargeDb>,
  ) {}

  async findAll(): Promise<Charge[]> {
    const today = new Date();

    const filteredCharges = await this.repository.find({
      where: {
        debtDueDate: LessThan(today),
      },
    });

    if (!filteredCharges) {
      return undefined;
    }

    return filteredCharges.map(this.toDomain);
  }

  async saveCharge(data: Charge): Promise<Charge> {
    const chargeFile = this.toEntity(data);

    const savedCharge = await this.repository.save(chargeFile);

    return this.toDomain(savedCharge);
  }

  private toDomain(data: ChargeDb): Charge {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      governmentId: data.governmentId,
      debtAmount: data.debtAmount,
      debtDueDate: data.debtDueDate,
      debtId: data.debtId,
    };
  }

  private toEntity(data: Charge): Omit<ChargeDb, 'id'> {
    return {
      name: data.name,
      email: data.email,
      governmentId: data.governmentId,
      debtAmount: data.debtAmount,
      debtDueDate: data.debtDueDate,
      debtId: data.debtId,
    };
  }
}
