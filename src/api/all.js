import { isIterable } from '../utils'
function all(iterator) {
    return new Promise((resolve, reject) => {
        // 对参数进行校验,必须是可迭代对象
        if(!isIterable(iterator)) {
            reject(new TypeError(`${iterator} ${iterator} is not iterable`))
        }

        const result = []
        const len = 0
        // 可迭代对象统一转换成数组
        iterator = Array.from(iterator)
        if(!iterator.length) {
            resolve(result)
        }

        for (let i = 0; i < iterator.length; i++) {
            const item = iterator[i];
            // 统一转换成promise对象
            Promise.resolve(item).then(res => {
                result[i] = res
                // 所有的成功才会成功并且更新值
                if(++len === iterator.length) {
                    resolve(result)
                } 
            // 只要有一个失败就会失败
            }).catch(reject)
        }
        return result
    })
    
}