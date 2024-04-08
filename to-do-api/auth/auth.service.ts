import { 
    Injectable, 
    UnauthorizedException, 
    forwardRef, 
    Inject 
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

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
            console.log('Invalid password');
            throw new UnauthorizedException('Invalid Password');
        }
        const payload = { sub: user.id, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
