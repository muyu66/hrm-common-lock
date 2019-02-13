import test from 'ava';
import { Lock } from '../lib/lock';
import { MemoryEngine } from '../lib/stroage_engine/memory.engine';
import { ConstState } from '../lib/const/state.const';

let lock: Lock;
test.beforeEach(async t => {
    const memoryEngine = new MemoryEngine();
    lock = new Lock(memoryEngine);
});

test('check', async t => {
    const result = await lock.check('test1', 'user1');
    const expection = ConstState.UNLOCK;
    t.is(result.state, expection);
});

test('lock', async t => {
    const result = await lock.lock('test1', 'user1', 300);
    const expection = 'test1';
    t.is(result, expection);
});

test('unlock', async t => {
    const result = await lock.unLock('test1', 'user1');
    const expection = true;
    t.is(result, expection);
});

test('selfCheck -> selfLock -> check -> lock -> unlock', async t => {
    const result = await lock.check('test1', 'user1');
    const expection = ConstState.UNLOCK;
    t.is(result.state, expection);

    const result2 = await lock.lock('test1', 'user1', 300);
    const expection2 = 'test1';
    t.is(result2, expection2);

    const result3 = await lock.check('test1', 'user2');
    const expection3 = ConstState.LOCK;
    t.is(result3.state, expection3);

    const result4 = await lock.lock('test1', 'user2', 300);
    const expection4 = false;
    t.is(result4, expection4);

    const result5 = await lock.unLock('test1', 'user2');
    const expection5 = false;
    t.is(result5, expection5);
});

test('selfCheck -> selfLock -> selfCheck -> selfLock -> selfUnlock -> selfCheck', async t => {
    const result = await lock.check('test1', 'user1');
    const expection = ConstState.UNLOCK;
    t.is(result.state, expection);

    const result2 = await lock.lock('test1', 'user1', 300);
    const expection2 = 'test1';
    t.is(result2, expection2);

    const result3 = await lock.check('test1', 'user1');
    const expection3 = ConstState.UNLOCK;
    t.is(result3.state, expection3);

    const result4 = await lock.lock('test1', 'user1', 300);
    const expection4 = 'test1';
    t.is(result4, expection4);

    const result5 = await lock.unLock('test1', 'user1');
    const expection5 = true;
    t.is(result5, expection5);

    const result6 = await lock.check('test1', 'user1');
    const expection6 = ConstState.UNLOCK;
    t.is(result6.state, expection6);
});