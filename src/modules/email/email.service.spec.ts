import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { Charge } from 'src/domain/entities/Charge';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(async () => null),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email with correct parameters', async () => {
    const mockChargeData: Charge & { paymentUrl: string } = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      debtAmount: 100,
      debtDueDate: new Date(),
      debtId: '111111',
      governmentId: '222222',
      paymentUrl: 'https://payment.example.com',
    };

    await service.sendChargeEmail(mockChargeData);

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: mockChargeData.email,
      subject: `Hey ${mockChargeData.name}`,
      template: './charge-user',
      context: {
        name: mockChargeData.name,
        amount: `R$ ${mockChargeData.debtAmount}`,
        dueDate: expect.any(String),
        paymentUrl: mockChargeData.paymentUrl,
      },
    });
  });
});
