export interface RateLimitStorage {
  /**
   * The internal storage with all the request records.
   * The key is a hashed key based on the current context and IP.
   * The value of each item wil be an array of epoch times which indicate all
   * the request's ttls in an ascending order.
   */
  storage: Record<string, number[]>;

  /**
   * Get a record via its key and return all its request ttls.
   */
  getRecord(key: string): Promise<number[]>;

  /**
   * Add a record to the storage. The record will automatically be removed from
   * the storage once its TTL has been reached.
   */
  addRecord(key: string, ttl: number): Promise<void>;
}

export const RateLimitStorage = Symbol('RateLimitStorage');
