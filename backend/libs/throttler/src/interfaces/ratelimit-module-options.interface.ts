import { ModuleMetadata, Type } from "@nestjs/common/interfaces";

export interface RateLimitModuleOptions {
  /**
   * The amount of requests that are allowed within the ttl's time window.
   */
  limit?: number;

  /**
   * The amount of seconds of how many requests are allowed within this time.
   */
  ttl?: number;

  /**
   * The storage class to use where all the record will be stored in.
   */
  storage?: any;
}

export interface ThrottlerOptionsFactory {
  createThrottlerOptions(): Promise<RateLimitModuleOptions> | RateLimitModuleOptions;
}

export interface ThrottlerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ThrottlerOptionsFactory>;
  useClass?: Type<ThrottlerOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RateLimitModuleOptions> | RateLimitModuleOptions;
  inject?: any[];
}
