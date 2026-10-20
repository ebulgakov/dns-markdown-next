import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'DNS Markdown API',
    };
  }
}
