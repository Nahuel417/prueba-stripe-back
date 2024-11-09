import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';


@Injectable()
export class PaymentService {
  
  private stripe: Stripe;

  constructor( 
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>) {
    
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });
  }


  
  async createPaymentIntent(amount: number, currency: string, reason: string, postedJobId: number, clientId: number, professionalId: number) {
    
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        reason,
        postedJobId,
        clientId,
        professionalId
      } 
    })
    
    return {
      clientSecret: paymentIntent.client_secret
    }
  }

  async handlePaymentSuccess({amount, reason, status, postedJobId, clientId, professionalId}) {
    const payment = await this.paymentRepository.create({
      amount,
      currency: 'usd',
      status,
      reason,
      clientId: 1,
      professionalId: 1,
      postedJobId: 1,
    })

    await this.paymentRepository.save(payment)

    console.log(`Payment guardado correctamente en la base de datos.`);
  }


  async updatePaymentStatus(paymentId: any,) {
    const payment = await this.paymentRepository.findOne({
      where: {
        id: paymentId
      }
    })

    if (payment) {
      payment.status = 'fallido'
      await this.paymentRepository.save(payment)
    }
  }
  
}
