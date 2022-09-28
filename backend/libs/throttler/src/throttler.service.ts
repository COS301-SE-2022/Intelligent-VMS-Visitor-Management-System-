import { Injectable } from '@nestjs/common';
import { RateLimitStorage } from './interfaces/ratelimit-storage.interface';

@Injectable()
export class RateLimitStorageService implements RateLimitStorage {
    private _storage: Record<string, number[]> = {};

    get storage(): Record<string, number[]> {
        return this._storage;
    }

    async getRecord(key: string): Promise<number[]> {
        return this.storage[key] || [];
    }

    async addRecord(key: string, ttl: number) : Promise<void> {
        return;
    }
}
