import { Test, TestingModule } from '@nestjs/testing';
import { Charge } from 'src/infrastructure/database/entities/Charge.entity';
import { ChargeFileRepository } from '../../domain/repositories/ChargeFileRepository';
import { ChargeRepository } from '../../domain/repositories/ChargeRepository';
import { EmailService } from '../email/email.service';
import { ChargesService } from './charges.service';

const MockChargeFileRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  saveChargeFile: jest.fn(),
  findAll: jest.fn(),
};

const MockChargeFileRepositoryProvider = {
  provide: 'ChargeFileRepository',
  useValue: MockChargeFileRepository,
};

const MockChargeRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  saveCharge: jest.fn(),
  findAll: jest.fn(),
};

const MockChargeRepositoryProvider = {
  provide: 'ChargeRepository',
  useValue: MockChargeRepository,
};

describe('ChargesService', () => {
  let service: ChargesService;
  let chargeFileRepository: ChargeFileRepository;
  let chargeRepository: ChargeRepository;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargesService,
        MockChargeFileRepositoryProvider,
        MockChargeRepositoryProvider,
        {
          provide: EmailService,
          useValue: {
            sendChargeEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChargesService>(ChargesService);
    chargeRepository = module.get(MockChargeRepositoryProvider.provide);
    chargeFileRepository = module.get(MockChargeFileRepositoryProvider.provide);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process and save charges from file', async () => {
    const mockFile = {
      originalname: 'test.csv',
      buffer: Buffer.from(
        'name,governmentId,email,debtAmount,debtDueDate,debtId\nJohn Doe,11111111111,johndoe@example.com,1000,2023-01-01,123-abc',
      ),
    };

    await service.createCharges(mockFile as any);

    expect(chargeRepository.saveCharge).toHaveBeenCalled();
    expect(chargeFileRepository.saveChargeFile).toHaveBeenCalledWith(mockFile);
  });

  it('should retrieve charge files', async () => {
    await service.getChargesFiles();
    expect(chargeFileRepository.findAll).toHaveBeenCalled();
  });

  it('should trigger charge verification and send emails', async () => {
    const mockCharges: Charge[] = [
      {
        id: 1,
        email: 'test1@example.com',
        debtAmount: 1000,
        debtId: 'any_id_1',
        name: 'any_name',
        debtDueDate: new Date(),
        governmentId: 'any_id',
      },
    ];

    jest.spyOn(chargeRepository, 'findAll').mockResolvedValueOnce(mockCharges);

    await service.triggerChargeVerification();

    expect(emailService.sendChargeEmail).toHaveBeenCalledTimes(
      mockCharges.length,
    );

    mockCharges.forEach((charge) => {
      expect(emailService.sendChargeEmail).toHaveBeenCalledWith(
        expect.objectContaining({ email: charge.email }),
      );
    });
  });
});
