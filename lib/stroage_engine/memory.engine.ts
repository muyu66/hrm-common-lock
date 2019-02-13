import { IStorageEngine } from '../interface/storage_engine.interface';
import { IType } from '../interface/type.interface';
import * as R from 'ramda';

export class MemoryEngine implements IStorageEngine {

    private data: IType.Object = {};

    public async getObj(key: string): Promise<IType.Object | undefined> {
        return R.prop(key, this.data);
    }

    public async setObj(key: string, value: IType.Object, expire: number = -1): Promise<boolean> {
        const xLens = R.lensProp(key);
        this.data = R.set(xLens, value, this.data);
        return true;
    }

    public async delete(key: string): Promise<boolean> {
        this.data = R.omit([key], this.data);
        return true;
    }

    public async get(key: string): Promise<string | null> {
        return R.prop(key, this.data);
    }

    public async set(key: string, value: string, expire: number = -1): Promise<boolean> {
        const xLens = R.lensProp(key);
        this.data = R.set(xLens, value, this.data);
        return true;
    }

    public async eval(...args: any[]): Promise<any> {
        return 'mock';
    }

}