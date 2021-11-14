
/**
 * 
 * @param {迭代器, 数组、Set、Map} iterable 
 * @returns 返回一个Promise对象
 */
const promiseAll = iterable => {
    // 1. 返回Promise对象
    return new Promise((resolve, reject) => {
        try {
            // 2. 同义转换成数组
            const list = [...iterable]
            const result = []
            let count = 0
            if(!list.length) {
                resolve(result)
            }
           // 3. 需要原属组的顺序返回，所以根据它的索引来插入数据
            list.forEach((item, idx) => {
                Promise.resolve(item)
                .then(res => {
                    result[idx] = res
                    if(list.length === ++count) {
                        resolve(result)
                    }
                })
                .catch(error => reject(error))
            })
        } catch (error) {
            reject(error)
        }
    })
}