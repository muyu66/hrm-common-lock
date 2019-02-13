import { IStorageEngine } from '../interface/storage_engine.interface';
import { IType } from '../interface/type.interface';
import { RedisClient } from 'redis';
import { promisify as Promisify } from 'util';

const SET_IF_NOT_EXIST = 'NX';
const SET_WITH_EXPIRE_TIME = 'EX';

export class RedisEngine implements IStorageEngine {

    private redisClient: RedisClient;

    constructor(
        redisClient: RedisClient,
    ) {
        if (!redisClient) throw Error('StorageEngine error');
        this.redisClient = redisClient;
    }

    public async getObj(key: string): Promise<IType.Object | undefined> {
        const hgetallAsync = Promisify(this.redisClient.hgetall).bind(this.redisClient);
        return hgetallAsync(key);
    }

    public async setObj(key: string, value: IType.Object, expire: number = -1): Promise<boolean> {
        const hmsetAsync = Promisify(this.redisClient.hmset).bind(this.redisClient);
        const expireAsync = Promisify(this.redisClient.expire).bind(this.redisClient);

        await hmsetAsync(key, value);
        await expireAsync(key, expire);
        return true;
    }

    public async delete(key: string): Promise<boolean> {
        const delAsync = Promisify(this.redisClient.del).bind(this.redisClient);
        await delAsync(key);
        return true;
    }

    public async get(key: string): Promise<string | null> {
        const getAsync = Promisify(this.redisClient.get).bind(this.redisClient);

        return getAsync(key);
    }

    public async set(key: string, value: string, expire: number = -1): Promise<boolean> {
        const setAsync = Promisify(this.redisClient.set).bind(this.redisClient);

        const result = await setAsync(key, value, SET_WITH_EXPIRE_TIME, expire, SET_IF_NOT_EXIST);
        return !!result;
    }

    public async eval(...args: any[]): Promise<any> {
        const evalAsync = Promisify(this.redisClient.eval).bind(this.redisClient);

        return evalAsync(...args);
    }

}