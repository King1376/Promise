
/**
 * 
 * @param {迭代器} iterable 
 * @returns 返回一个Promise对象
 */
const promiseAll = iterable => {
    // 1. 返回Promise对象
    return new Promise((resolve, reject) => {
        try {
            // 2. 迭代器转换成数组
            const list = Array.from(iterable)
            const result = [],
                  count = 0;
           // 3. 遍历数组，按顺序插入新的数组
            for(let i = 0; i < list.length; i++) {
                Promise.resolve(list[i]).then(res => {
                    result[i] = res
                    if(list.length === ++count) {
                        resolve(result)
                    }
                }).catch(error => reject(error))

            }
            result.length === list.length && resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}