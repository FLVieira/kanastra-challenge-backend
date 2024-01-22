import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { Charge } from 'src/domain/entities/Charge';

type ChargeEmailData = Charge;

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendChargeEmail(data: ChargeEmailData & { paymentUrl: string }) {
    console.log('Sending email to: ', data);
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
      .then(() => console.log('Email sent successfully'))
      .catch((error) => console.log(error));
  }
}
