import { reactive } from '../reactivity/reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observe = reactive(original);

    expect(observe).not.toBe(original);

    expect(observe.foo).toBe(1);
  });
});
