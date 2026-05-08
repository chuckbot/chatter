import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requests = new Map<
    string,
    { count: number; resetTime: number }
  >();
  private readonly limit = 5;
  private readonly windowMs = 60 * 1000;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ip: string = request.ip || request.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = this.requests.get(ip);

    if (record && now > record.resetTime) {
      this.requests.delete(ip);
    }

    const currentRecord = this.requests.get(ip);
    if (!currentRecord) {
      this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (currentRecord.count >= this.limit) {
      throw new HttpException(
        { statusCode: 429, message: 'Too many requests. Max 5 per minute.' },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    currentRecord.count++;
    return true;
  }
}
