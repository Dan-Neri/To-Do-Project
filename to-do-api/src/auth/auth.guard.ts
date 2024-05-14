/**
 * The AuthGuard class provides a way to protect all other routes within
 * the app from unauthorized access by extracting the JWT from the
 * request header and using Nest's JwtService to verify it against the
 * JWT_SECRET .env variable.
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import GetENV from '../getENV';

export interface RequestWithUser extends Request {
    user: {
        sub: string,
        username: string
    };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

    /*Return true if the header contains a valid JWT or false otherwise.
    Also append the contents of the JWT to the request with the property
    of 'user' if successfully decoded.*/
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
          throw new UnauthorizedException();
        }
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: GetENV('JWT_SECRET')
            }
          );
          // 💡 We're assigning the payload to the request object here
          // so that we can access it in our route handlers
          request['user'] = payload;
        } catch {
            console.log('JWT Invalid');
          throw new UnauthorizedException();
        }
        return true;
    }

    /*Return the JWT, Bearer token, from the request header or undefined
    if not found.*/
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
