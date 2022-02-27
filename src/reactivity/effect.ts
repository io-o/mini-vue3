class ReactiveEffect {
  private _fn: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }
}

let activeEffect;
export const effect = (fn, options?) => {
  const scheduler = options?.scheduler;
  const effct = new ReactiveEffect(fn, scheduler);

  effct.run();

  return effct.run.bind(effct);
};

const targetMap = new Map();
export const track = (target, key) => {
  // target -> key -> dep

  // 1 获取targetMap内的 keyMap
  let keyMap = targetMap.get(target);
  // 2 判断 flase 初始化keyMap
  if (!keyMap) {
    keyMap = new Map();
    // 3 初始化填充target
    targetMap.set(target, keyMap);
  }

  // 4 获取keyMap内具体函数、值
  let dep = keyMap.get(key);
  // 5 判断 false 初始化dep
  if (!dep) {
    dep = new Set();
    // 6 初始化填充key
    keyMap.set(key, dep);
  }

  // 7 把当前依赖的执行上下文填充
  dep.add(activeEffect);
};

export const trigger = (target, key) => {
  const keyMap = targetMap.get(target);

  const dep = keyMap.get(key);

  // 拿到依赖执行
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};
