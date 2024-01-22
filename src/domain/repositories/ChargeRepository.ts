import { Charge } from '../entities/Charge';

export interface ChargeRepository {
  findAll(): Promise<Charge[]>;
  saveCharge(data: Charge): Promise<Charge>;
}
