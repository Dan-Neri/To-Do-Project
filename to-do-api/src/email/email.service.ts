/**
 * The EmailService provides the sendResetEmail method which facilitates
 * sending a password reset email via NodeMailer.
 */
import { 
    Injectable, 
    ConflictException, 
    forwardRef, 
    Inject 
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import sendEmail from './email.config';
import GetENV from '../getENV';
import resetEmailTemplate from './resetEmailTemplate';

@Injectable()
export class EmailService {
    constructor(
        private usersService: UsersService,
    ) {}

    /*Take a user object and a JWT. Configure options and a reset link
    with this information. Then pass the options to the sendEmail method
    of email.config to actually send the message.*/
    async sendResetEmail(user: User, token: string) {
        const mailOptions = {
            from: GetENV('EMAIL_USERNAME'),
            to: user.email,
            subject: 'Dan\'s project planning tool: Reset your password',
            html: resetEmailTemplate(user.id, token)
        };

        await sendEmail(mailOptions, () => {
        });
    }
}
