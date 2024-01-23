import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { ChargeFileRepository } from '../../domain/repositories/ChargeFileRepository';
import { ChargeRepository } from '../../domain/repositories/ChargeRepository';
import { EmailService } from '../email/email.service';
import { IChargesService } from './charges.service.interface';

@Injectable()
export class ChargesService implements IChargesService {
  private readonly logger = new Logger('ChargesService');

  constructor(
    @Inject('ChargeFileRepository')
    private readonly chargeFileRepository: ChargeFileRepository,
    @Inject('ChargeRepository')
    private readonly chargeRepository: ChargeRepository,
    private emailService: EmailService,
  ) {}

  public async createCharges(file: Express.Multer.File) {
    this.logger.log('Reading charges from file named: ', file.originalname);
    const stream = Readable.from(file.buffer.toString());

    const requiredKeys = [
      'name',
      'governmentId',
      'email',
      'debtAmount',
      'debtDueDate',
      'debtId',
    ];

    return new Promise<void>((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', async (data) => {
          requiredKeys.forEach((key) => {
            if (!data[key]) {
              throw new Error('Invalid data');
            }
          });

          const charge = { ...data };
          await this.chargeRepository.saveCharge(charge);
        })
        .on('error', (error) => {
          this.logger.log(
            'Error reading charges from file ',
            file.originalname,
            ', the following error occurred: ',
            JSON.stringify(error),
          );
          reject(error);
        })
        .on('end', async () => {
          await this.chargeFileRepository.saveChargeFile(file);
          this.logger.log(
            'All charges from ',
            file.originalname,
            ' wore successfully saved',
          );
          resolve();
        });
    });
  }

  public async getChargesFiles() {
    const files = await this.chargeFileRepository.findAll();
    return {
      data: files,
    };
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  public async triggerChargeVerification() {
    this.logger.log('The stored charges are being verified.');
    const files = await this.chargeRepository.findAll();

    for (let i = 0; i < files.length; i++) {
      const chargeData = files[i];

      await this.emailService.sendChargeEmail({
        ...chargeData,
        paymentUrl: '',
      });
    }
  }
}
