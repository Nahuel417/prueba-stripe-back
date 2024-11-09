import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import Stripe from 'stripe';

@Module({
  imports: [ TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [PaymentService, 
    {
      provide: 'STRIPE',
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2024-10-28.acacia', 
        });
      },
    },
  ],
  exports: ['STRIPE', TypeOrmModule],
})
export class PaymentModule {}
