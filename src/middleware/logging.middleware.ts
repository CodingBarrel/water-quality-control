import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const body = req.body;

    res.on('finish', () => {
      this.logger.log(
        `${method} ${originalUrl} → ${res.statusCode} | body: ${JSON.stringify(body)}`,
      );
    });

    next();
  }
}
