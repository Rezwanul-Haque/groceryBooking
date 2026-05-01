import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  private format(level: string, message: string, context?: string, extra?: object) {
    return JSON.stringify({ level, message, context, ...extra, timestamp: new Date().toISOString() });
  }

  log(message: string, context?: string) {
    console.log(this.format('info', message, context));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(this.format('error', message, context, { trace }));
  }

  warn(message: string, context?: string) {
    console.warn(this.format('warn', message, context));
  }

  debug(message: string, context?: string) {
    console.debug(this.format('debug', message, context));
  }
}
