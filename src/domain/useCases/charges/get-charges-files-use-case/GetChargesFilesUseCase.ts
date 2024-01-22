import { Inject, Injectable } from '@nestjs/common';
import { ChargesService } from 'src/modules/charges/charges.service';
import { IChargesService } from 'src/modules/charges/charges.service.interface';

@Injectable()
export class GetChargesFilesUseCase {
  constructor(
    @Inject(ChargesService)
    private chargesService: IChargesService,
  ) {}

  public async execute() {
    const filesData = await this.chargesService.getChargesFiles();
    return filesData;
  }
}
