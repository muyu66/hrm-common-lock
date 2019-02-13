import { IType } from './type.interface';

export interface IStorageEngine {

    /**
     * physical delete should be used here
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     * @memberof IStorageEngine
     */
    delete(key: string): Promise<boolean>;

    getObj(key: string): Promise<IType.Object | undefined>;

    /**
     * setObj
     *
     * @param {string} key
     * @param {IType.Object} value
     * @param {number} [expire] unit should be SECOND
     * @returns {(Promise<boolean>)}
     * @memberof IStorageEngine
     */
    setObj(key: string, value: IType.Object, expire: number): Promise<boolean>;

    get(key: string): Promise<string | null>;

    /**
     * set
     *
     * @param {string} key
     * @param {IType.Object} value
     * @param {number} [expire] unit should be SECOND
     * @returns {(Promise<boolean>)}
     * @memberof IStorageEngine
     */
    set(key: string, value: string, expire: number): Promise<boolean>;

    eval(...args: any[]): Promise<any>;

}