/**
 * The EmailModule provides NestJS configuration details for the 
 * EmailService which handles sending email via NodeMailer. There is no
 * dedicated controller for the EmailModule. Instead it exports the
 * EmailService so that other modules can call the send mail methods
 * directly. See ~./email/email.config.ts for email configuration 
 * settings.
 */
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    providers: [EmailService],
    controllers: [],
    exports: [EmailService]
})
export class EmailModule {}
