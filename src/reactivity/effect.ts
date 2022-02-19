class ReactiveEffect {
  private _fn: () => void;
  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    this._fn();
  }
}

let activeEffect;
export const effect = (fn) => {
  const effct = new ReactiveEffect(fn);

  effct.run();
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
    effect.run();
  }
};
