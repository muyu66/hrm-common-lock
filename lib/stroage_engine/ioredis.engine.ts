import { IStorageEngine } from '../interface/storage_engine.interface';
import { IType } from '../interface/type.interface';
import { Redis } from 'ioredis';

const SET_IF_NOT_EXIST = 'NX';
const SET_WITH_EXPIRE_TIME = 'EX';

export class IoredisEngine implements IStorageEngine {

    private redisClient: Redis;

    constructor(
        redisClient: Redis,
    ) {
        if (!redisClient) throw Error('StorageEngine error');
        this.redisClient = redisClient;
    }

    public async getObj(key: string): Promise<IType.Object | undefined> {
        return this.redisClient.hgetall(key);
    }

    public async setObj(key: string, value: IType.Object, expire: number = -1): Promise<boolean> {
        await this.redisClient.hmset(key, value);
        await this.redisClient.expire(key, expire);
        return true;
    }

    public async delete(key: string): Promise<boolean> {
        await this.redisClient.del(key);
        return true;
    }

    public async get(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }

    public async set(key: string, value: string, expire: number = -1): Promise<boolean> {
        const result = await this.redisClient.set(key, value, SET_WITH_EXPIRE_TIME, expire, SET_IF_NOT_EXIST);
        return !!result;
    }

    public async eval(...args: any[]): Promise<any> {
        return this.redisClient.eval(...args);
    }

}