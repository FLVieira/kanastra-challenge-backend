import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ChargesModule } from '../charges/charges.module';
import { EmailModule } from '../email/email.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule,
    ChargesModule,
    HealthModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
