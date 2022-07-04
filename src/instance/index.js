const { statusMap, DEFAULTVALUE } = require("../config");
const { isFunction, equal, isObject } = require("../utils");

// 处理then方法返回promise的逻辑
const resolvePromise = (p, x, resolve, reject) => {
  let isInvoked = false;
  // 当then返回promise本身时，抛出异常
  if (equal(p, x)) {
    reject(new TypeError("cannot return to oneself"));
    return;
  }

  // x 函数或者对象
  if (isObject(x) || isFunction(x)) {
    try {
      let then = x.then;
      if (isFunction(then)) {
        then.call(
          x,
          (y) => {
            if (isInvoked) return;
            isInvoked = true;
            resolvePromise(p, y, resolve, reject);
          },
          (r) => {
            if (isInvoked) return;
            isInvoked = true;
            reject(r);
          }
        );
      } else {
        if (isInvoked) return;
        isInvoked = true;
        resolve(x);
      }
    } catch (error) {
      if (isInvoked) return;
      isInvoked = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
};

class KingPromise {
  // 初始化状态
  status = statusMap.PENDING;
  // 初始化值
  value = DEFAULTVALUE;

  // 成功回调函数集合
  onFulfilledCallbacks = [];
  // 失败回调函数集合
  onRejectedCallbacks = [];
  constructor(executor) {
    // 参数类型判断
    if (!isFunction(executor)) {
      throw new TypeError(`${typeof executor} ${executor} is not a function`);
    }

    // 遍历回调函数集合并执行
    const iterateCallbacks = (list) => {
      while (list.length) {
        const callback = list.shift();
        callback && callback();
      }
    };

    // 改变promise的状态和值,只有状态为PENDING才会更新状态和值
    const updatePromiseStatusAndValue = (status, value) => {
      if (equal(this.status, statusMap.PENDING)) {
        this.status = status;
        this.value = value;
      }
    };

    // resolve
    const resolve = (value) => {
      updatePromiseStatusAndValue(statusMap.FULFILLED, value);
      iterateCallbacks(this.onFulfilledCallbacks);
    };

    // reject
    const reject = (reason) => {
      updatePromiseStatusAndValue(statusMap.REJECTED, reason);
      iterateCallbacks(this.onRejectedCallbacks);
    };

    // 执行执行器函数executor
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then
  then(onFulfilled, onRejected) {
    // 回调函数微任务处理逻辑
    const callbackMicroTask = (callback, resolve, reject) => {
      // 做微任务处理
      queueMicrotask(() => {
        try {
          // 回调函数执行并返回
          const x = callback(this.value);
          resolvePromise(p, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    };

    // then方法最终返回的promise
    const p = new KingPromise((resolve, reject) => {
      onFulfilled = isFunction(onFulfilled) ? onFulfilled : (data) => data;
      onRejected = isFunction(onRejected)
        ? onRejected
        : (error) => reject(error);
      // 状态为fulfilled
      if (equal(this.status, statusMap.FULFILLED)) {
        callbackMicroTask(onFulfilled, resolve, reject);
      }

      // 状态为rejected
      if (equal(this.status, statusMap.REJECTED)) {
        callbackMicroTask(onRejected, resolve, reject);
      }

      // 状态为pending
      if (equal(this.status, statusMap.PENDING)) {
        this.onFulfilledCallbacks.push(() => {
          callbackMicroTask(onFulfilled, resolve, reject);
        });
        this.onRejectedCallbacks.push(() => {
          callbackMicroTask(onRejected, resolve, reject);
        });
      }
    });

    return p;
  }
}

KingPromise.defer = KingPromise.deferred = function () {
  let deferred = {};

  deferred.promise = new KingPromise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

module.exports = KingPromise;
