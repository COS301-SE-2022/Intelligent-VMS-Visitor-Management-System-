import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
    protected headerPrefix = 'X-RateLimit';
    protected errorMessage = throttlerMessage;

  constructor(
    @InjectThrottlerOptions() protected readonly options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
  ) {}
}
