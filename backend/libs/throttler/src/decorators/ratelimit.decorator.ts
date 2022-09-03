import { Inject } from '@nestjs/common';

const setThrottlerMetadata = (target: any, limit: number, ttl: number): void => {
  Reflect.defineMetadata("THROTTLER:TTL", ttl, target);
  Reflect.defineMetadata("THROTTLER:LIMIT", limit, target);
}

// Guard to handle incoming requests
export const RateLimit = (limit = 20, ttl = 60): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      setThrottlerMetadata(descriptor.value, limit, ttl);
      return descriptor;
    }
    setThrottlerMetadata(target, limit, ttl);
    return target;
  };
};

export const InjectThrottlerOptions = () => Inject(getOptionsToken());
