import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './feauters/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from './feauters/user/user.module';
import { VinylModule } from './feauters/vinyl/vinyl.model';
import { ReviewModule } from './feauters/review/review.model';
import { configuration } from './configuration/configuration';
import { StorageModule } from './feauters/storage/storage.module';
import { SystemLogsModule } from './feauters/systenLogs/system.logs.module';
import { StripeModule } from './feauters/stripe/stripe.module';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    VinylModule,
    ReviewModule,
    CqrsModule,
    StorageModule,
    SystemLogsModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
