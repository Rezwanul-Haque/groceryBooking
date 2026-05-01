import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      console.log(
        JSON.stringify({
          level: 'info',
          method,
          url: originalUrl,
          statusCode: res.statusCode,
          duration: `${Date.now() - start}ms`,
          timestamp: new Date().toISOString(),
        }),
      );
    });

    next();
  }
}
