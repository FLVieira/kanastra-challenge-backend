import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import { Charge } from 'src/domain/entities/Charge';

type ChargeEmailData = Charge;

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger = new Logger(EmailService.name),
  ) {}

  async sendChargeEmail(data: ChargeEmailData & { paymentUrl: string }) {
    this.logger.log('Sending charge email to: ', data.email);
    await this.mailerService
      .sendMail({
        to: data.email,
        subject: `Hey ${data.name}`,
        template: './charge-user',
        context: {
          name: data.name,
          amount: `R$ ${data.debtAmount}`,
          dueDate: dayjs(data.debtDueDate).format('DD/MM/YYYY'),
          paymentUrl: data.paymentUrl,
        },
      })
      .then(() => this.logger.log('Email sent successfully to: ', data.email))
      .catch((error) => console.log(error));
  }
}
