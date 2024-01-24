import { Inject, Injectable } from '@nestjs/common';
import { ChargesService } from '../../../../modules/charges/charges.service';
import { IChargesService } from '../../../../modules/charges/charges.service.interface';

@Injectable()
export class CreateChargeFileUseCase {
  constructor(
    @Inject(ChargesService)
    private chargesService: IChargesService,
  ) {}

  public async execute(file: Express.Multer.File) {
    await this.chargesService.createCharges(file);
  }
}
