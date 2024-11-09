import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import typeormConfig from './config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [PaymentModule,
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfig] }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get('typeorm'),
        }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
