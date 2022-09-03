import { Provider } from '@nestjs/common';
import { RateLimitModuleOptions } from '../interfaces/ratelimit-module-options.interface';
import { RateLimitStorage } from '../interfaces/ratelimit-storage.interface';
import { RateLimitStorageService } from '../throttler.service';

const OPTIONS_TOKEN = "RATELIMIT:MODULE_OPTIONS";

export function createThrottlerProviders(options: RateLimitModuleOptions): Provider[] {
  return [
    {
      provide: OPTIONS_TOKEN,
      useValue: options,
    },
  ];
}

export const ThrottlerStorageProvider = {
  provide: RateLimitStorage,
  useFactory: (options: ThrottlerModuleOptions) => {
    return options.storage ? options.storage : new ThrottlerStorageService();
  },
  inject: [OPTIONS_TOKEN],
};

/**
 * A utility function for getting the options injection token
 */
/*eslint-disable*/
export const getOptionsToken = () => OPTIONS_TOKEN;

/**
 * A utility function for getting the storage injection token
 */
export const getStorageToken = () => RateLimitStorage;
/*eslint-enable*/
