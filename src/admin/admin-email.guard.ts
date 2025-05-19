import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminEmailGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid token format');

    try {
      const payload = jwt.verify(token, 'this_is_a_secret') as { role: string };

      if (payload.role !== 'superadmin') {
        throw new UnauthorizedException('Unauthorized access');
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
