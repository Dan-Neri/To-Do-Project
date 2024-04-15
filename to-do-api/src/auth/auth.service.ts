/**
 * The AuthService provides all methods referenced by the 
 * AuthController.
 */
import { 
    Injectable, 
    UnauthorizedException, 
    BadRequestException,
    forwardRef, 
    Inject 
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PwResetDTO } from './pw-reset.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private emailService: EmailService
    ) {}

    /*Verify username and password. Return JWT if successful or throw an
    exception otherwise.*/
    async signIn(
        username: string, 
        pass: string
    ): Promise<{ access_token: string}> {
        const user = await this.usersService.findByName(username);
        let isMatch = false;
        if (!user) {
            throw new UnauthorizedException('Invalid Username')
        }
        try {
            isMatch = await bcrypt.compare(pass, user.password);
        }
        catch (error) {
            console.log('Error comparing passwords');
            throw new Error(error);
        }
        if (!isMatch) {
            throw new UnauthorizedException('Invalid Password');
        }
        const payload = { sub: user.id, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(
                payload,
                {
                    expiresIn: '1h',
                    
                }
            )
        };
    }
    
    /*Find a user with the given email address, create a single use JWT
    with the user's current password as the secret, and send a password
    reset email.*/
    async sendResetEmail(email: string) {
        email = email.toLowerCase();
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const payload = { sub: user.id, secret: user.password }
        const emailToken = await this.jwtService.signAsync(
            payload, {
                secret: user.password,
                expiresIn: '15m'
            }
        )
        
        await this.emailService.sendResetEmail(user, emailToken);
    }
    
    /*Verify the JWT against the matching user's current password. if
    valid, call the update method from UsersService to change the
    password. Once the password is changed, the same JWT will fail
    verification against the new password ensuring that each JWT can
    only be used once.*/
    async resetPassword(data: PwResetDTO) {
    
        const { userID, token, password } = data;
        let isSame;
        if (!token) {
          throw new UnauthorizedException('Missing Auth Token');
        }
        const user = await this.usersService.findById(userID);
        if (!user) {
            throw new BadRequestException('User Not Found');
        }
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: user.password
            }
          );
        } catch {
            throw new UnauthorizedException('Invalid Auth Token');
        }
        try {
            //Don't allow users to change to the same password.
            isSame = await bcrypt.compare(password, user.password);
        }
        catch (error) {
            throw new Error(error);
        }
        if (isSame) {
            throw new BadRequestException('Same Password');
        }
        
        return this.usersService.update(userID,{ password: password });
    }
    
    //Hash the given password using bcrypt and return it.
    async hashPass(
        pass: string, 
        saltRounds:number = 10
    ): Promise<string> {
        let passHash; 
        try {
            passHash = await bcrypt.hash(pass, saltRounds);
        }
        catch (error) {
            console.error(error);
            throw new Error('Error hashing password');
        }
        return passHash;
    }
}
