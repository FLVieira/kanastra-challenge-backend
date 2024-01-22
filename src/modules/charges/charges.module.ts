import { Module } from '@nestjs/common';
import { CreateChargeFileUseCase } from 'src/domain/useCases/charges/create-charge-file-use-case/CreateChargeFileUseCase';
import { GetChargesFilesUseCase } from 'src/domain/useCases/charges/get-charges-files-use-case/GetChargesFilesUseCase';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { chargesProviders } from 'src/infrastructure/database/providers/charge-files.providers';
import { EmailModule } from '../email/email.module';
import { ChargesController } from './charges.controller';
import { ChargesService } from './charges.service';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [ChargesController],
  providers: [
    ChargesService,
    ...chargesProviders,
    GetChargesFilesUseCase,
    CreateChargeFileUseCase,
  ],
})
export class ChargesModule {}
