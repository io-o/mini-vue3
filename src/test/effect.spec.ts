import { reactive } from '../reactivity/reactive';
import { effect } from '../reactivity/effect';

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    });

    let nextAge;

    effect(() => (nextAge = user.age + 1));

    expect(nextAge).toBe(11);

    user.age++;
    expect(nextAge).toBe(12);
  });

  it('should return runner', () => {
    // effect(fn) -> function (runner) -> fn -> return

    let foo = 10;

    const runner = effect(() => {
      foo++;
      return 'foo';
    });

    expect(foo).toBe(11);

    const r = runner();

    expect(foo).toBe(12);

    expect(r).toBe('foo');
  });
});

it('scheduler', () => {
  let dummy;

  let run: any;

  const scheduler = jest.fn(() => {
    run = runner;
  });

  const obj = reactive({
    foo: 1,
  });
  const runner = effect(
    () => {
      dummy = obj.foo;
    },
    {
      scheduler,
    }
  );

  // 断言scheduler不会执行
  expect(scheduler).not.toHaveBeenCalled();

  expect(dummy).toBe(1);

  obj.foo++;
  // 断言scheduler会执行一次
  expect(scheduler).toHaveBeenCalledTimes(1);

  expect(dummy).toBe(1);

  run();

  expect(dummy).toBe(2);
});
