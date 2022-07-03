import { statusMap, DEFAULTVALUE } from '../config'
import { isFunction, equal, isObject } from '../utils'

class KingPromise {
    
    constructor(executor) {
        // 初始化状态
        this.status = statusMap.PENDING
        // 初始化值
        this.value = DEFAULTVALUE

        // 成功回调函数集合
        const onFulfilledCallbacks = []
        // 失败回调函数集合
        const onRejectedCallbacks = []

        // 参数类型判断
        if(isFunction(executor)) {
            throw new TypeError(`${typeof executor} ${executor} is not a function`)
        }

        // 执行执行器函数executor
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }

        // 遍历回调函数集合并执行
        function iterateCallbacks(list) {
            while(list.length) {
                const callback = list.shift()
                callback && callback()
            }
        }

        // 改变promise的状态和值,只有状态为PENDING才会更新状态和值
        function updatePromiseStatusAndValue(status, value) {
            if(equal(this.status, statusMap.PENDING)) {
                this.status = status
                this.vlaue = value
            }
        }

        // resolve
        function resolve(value) {
            updatePromiseStatusAndValue(statusMap.FULFILLED, value)
            iterateCallbacks(onFulfilledCallbacks)
        }

        // reject
        function reject(reason) {
            updatePromiseStatusAndValue(statusMap.REJECTED, reason)
            iterateCallbacks(onRejectedCallbacks)
        }
    }

    // then
    then(onFulfilled, onRejected) {
        // 处理返回promise逻辑
        const resolvePromise = (p, x, resolve, reject) => {
            // 
            if(equal(p, x)) {
                reject(new TypeError('cannot return to oneself'))
            }

            // x 函数或者对象
            if(isFunction(x) || isObject(x)) {
                try {
                    let then = x.then
                    if(isFunction(then)) {
                        then.call(
                            x,
                            y => resolvePromise(p, x, resolve, reject),
                            z => reject(z) )
                    } else {
                        resolve(x)
                    }
                } catch (error) {
                    reject(error)
                }
            } else {
                resolve(x)
            }


        }

        // 回调函数微任务处理逻辑
        const callbackMicroTask = (p, callback, resolve, reject) => {
            // 做微任务处理
            queueMicrotask(() => {
                try {
                    // 回调函数执行并返回
                    const x = callback()
                    resolvePromise(p, x, resolve, reject)
                } catch (error) {
                    reject(error)
                }
            })
        }

        // then方法最终返回的promise
        const p = new KingPromise((resolve, reject) => {
            // 状态为fulfilled
            if(equal(this.status, statusMap.FULFILLED)) {
                callbackMicroTask(p, onFulfilled, resolve, reject)
            }

            // 状态为rejected
            if(equal(this.status, statusMap.REJECTED)) {
                callbackMicroTask(p, onRejected, resolve, reject)
            }

            // 状态为pending
            if(equal(this.status, statusMap.PENDING)) {
                onFulfilledCallbacks.push(() => {
                    callbackMicroTask(p, onFulfilled, resolve, reject)
                })
                onRejectedCallbacks.push(() => {
                    callbackMicroTask(p, onRejected, resolve, reject)
                })
            }
        })

        return p
    }
}
