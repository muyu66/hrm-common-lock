/**
 * XXX: Danger, this test case will affect the data of the local Redis
 */

import test from 'ava';
import { DistributedLock } from '../lib/distributed_lock';
import { IoredisEngine } from '../lib/stroage_engine/ioredis.engine';
import * as Redis from 'ioredis';

let lock: DistributedLock;

const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    db: 7,
});

test.beforeEach(async t => {
    const ioredisEngine = new IoredisEngine(redis);
    lock = new DistributedLock(ioredisEngine);
    await redis.flushdb();
});

test.serial('test1', t => {
    return Promise.all([
        lock.lock('admin', 'user1', 300),
        lock.lock('admin', 'user2', 300),
    ]).then(() => {
        t.fail();
    }).catch(e => {
        console.log(e);
        t.pass();
    });
});

test.serial('test2', async t => {
    await lock.lock('admin', 'user11', 300);
    await lock.unLock('admin', 'user11');
    await lock.lock('admin', 'user22', 300);
    t.pass();
});

test.serial('test3', async t => {
    try {
        await lock.lock('admin', 'user111', 300);
        await lock.lock('admin', 'user222', 300);
        t.fail();
    } catch (e) {
        console.log(e);
        t.pass();
    }
});

test.serial('test4', t => {
    return Promise.all([
        lock.lock('admin', 'user1', 300).catch(e => false),
        lock.lock('admin', 'user2', 300).catch(e => false),
        lock.lock('admin', 'user3', 300).catch(e => false),
    ]).then(result => {
        if (result[0]) return t.pass();
        return t.fail();
    });
});

test.serial('test5', async t => {
    try {
        await lock.lock('admin', 'user1', 1);
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
        await lock.lock('admin', 'user2', 300);
        t.pass();
    } catch (e) {
        console.log(e);
        t.fail();
    }
});