import { Controller, Get, Post, Body, Req, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentController {
  private stripe: Stripe;

  constructor(private readonly paymentService: PaymentService) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2024-10-28.acacia',
      });
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: {
    amount: number;
    currency: string;
    reason: string;
    postedJobId: number;
    clientId: number;
    professionalId: number;
  } ) {
    const {
      amount,
      currency,
      reason,
      postedJobId,
      clientId,
      professionalId
    } = body

     const paymentIntent = this.paymentService.createPaymentIntent(amount,
      currency,
      reason,
      postedJobId,
      clientId,
      professionalId);

      return paymentIntent
  }

  @Post('webhook')
  async webhook(@Req() req,
  @Headers('stripe-signature') signature: string,) {
    console.log('Webhook received', req.rawbody); 

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret
      )

      console.log('Webhook recibido:', event);
    } catch (error) {
      console.log('error webhook: ', error);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object

      await this.paymentService.handlePaymentSuccess({
        status: 'completado',
        reason: paymentIntent.metadata.reason,
        postedJobId: paymentIntent.metadata.postedJobId,
        clientId: paymentIntent.metadata.clientId,
        professionalId: paymentIntent.metadata.professionalId,
        amount: paymentIntent.amount_received,
      })

      console.log(`Payment guardado correctamente en la base de datos.`);
      
    } else if (event.type === 'payment_intent.payment_failed') {

      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;

      console.log(`Pago fallido para este Payment`);

      await this.paymentService.updatePaymentStatus(paymentId);
      
      console.log( `Estado del Payment ${paymentId} actualizado a 'fallido'.`);
    }

    return { received: true };
  }
}
