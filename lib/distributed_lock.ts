import { IStorageEngine } from './interface/storage_engine.interface';

export class DistributedLock {

    private storageEngine: IStorageEngine;

    constructor(
        storageEngine: IStorageEngine,
    ) {
        if (!storageEngine) throw Error('NotFound StorageEngine');
        this.storageEngine = storageEngine;
    }

    public async lock(uniqueKey: string, owner: string, expire = 300): Promise<boolean> {
        const lockOwner = await this.storageEngine.get(uniqueKey);
        if (lockOwner && lockOwner !== owner) throw Error('Lock error');
        // Allow owners to repeatedly lock, but will not execute
        if (lockOwner && lockOwner === owner) return true;

        const value = owner;
        const boolean = await this.storageEngine.set(uniqueKey, value, expire);
        if (!boolean) throw Error('Lock error');
        return true;
    }

    public async unLock(uniqueKey: string, owner: string): Promise<boolean> {
        const lockOwner = await this.storageEngine.get(uniqueKey);
        if (!lockOwner) return true;
        if (lockOwner !== owner) throw Error('UnLock error');

        const script = 'if redis.call(\'get\', KEYS[1]) == ARGV[1] then return redis.call(\'del\', KEYS[1]) else return 0 end';
        const result = await this.storageEngine.eval(script, 1, uniqueKey, lockOwner);
        if (result === '0') throw Error('UnLock error');
        return true;
    }

}