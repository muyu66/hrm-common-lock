import { IStorageEngine } from './interface/storage_engine.interface';
import { ConstState } from './const/state.const';

export class Lock {

    private storageEngine: IStorageEngine;

    constructor(
        storageEngine: IStorageEngine,
    ) {
        if (!storageEngine) throw Error('NotFound StorageEngine');
        this.storageEngine = storageEngine;
    }

    public async check(uniqueKey: string, owner: string): Promise<{ state: ConstState }> {
        const lockObj = await this.storageEngine.getObj(uniqueKey);
        if (!lockObj) return { state: ConstState.UNLOCK };
        // For the owner, it is always unlocked
        if (lockObj && lockObj.owner === owner) return { state: ConstState.UNLOCK };

        switch (lockObj.state) {
            case ConstState.FAIL:
            case ConstState.UNLOCK:
            case ConstState.LOCK:
                return {
                    state: lockObj.state,
                };
            default:
                throw Error('State exception');
        }
    }

    public async lock(uniqueKey: string, owner: string, expire = 300): Promise<string | false> {
        const lockObj = await this.storageEngine.getObj(uniqueKey);
        if (lockObj && lockObj.owner !== owner) return false;
        // Allow owners to repeatedly lock, but will not execute
        if (lockObj && lockObj.owner === owner) return uniqueKey;

        const value = Object.assign({
            id: uniqueKey,
            state: ConstState.LOCK,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }, { owner });
        const boolean = await this.storageEngine.setObj(uniqueKey, value, expire);
        if (!boolean) throw Error('Set error');
        return uniqueKey;
    }

    public async unLock(uniqueKey: string, owner: string): Promise<boolean> {
        const lockObj = await this.storageEngine.getObj(uniqueKey);
        if (!lockObj) return true;
        if (lockObj.owner !== owner) return false;
        const boolean = this.storageEngine.delete(uniqueKey);
        if (!boolean) throw Error('Delete error');
        return true;
    }

}