import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lee el token del header Authorization
      ignoreExpiration: false,
      secretOrKey: 'this_is_a_secret', // cambia esto o usa configService
    });
  }

  async validate(payload: any) {
    const { sub, dbName, email } = payload;
  
    if (!sub || typeof sub !== 'string' || !dbName) {
      throw new UnauthorizedException('Token inválido');
    }
  
    return { sub, email, dbName };
  }
}
