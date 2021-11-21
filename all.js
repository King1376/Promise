function kAll(iterable) {
    // 返回一个Promise对象
    return new Promise((resolve, reject) => {
        try {
            // 先把迭代器转换成数组
            const list = [...iterable]
            const result = []
            let count = 0
            if(!list.length) {
                resolve(result)
            }
            list.forEach((item, idx) => {
                // 为了保证数组的每一项都是Promise对象，先把Promise.resolve()转换成
                // Promise对象，在进行遍历
                Promise.resolve(item).then(res => {
                    // 为了保证原来顺序，通过索引来插值
                    result[idx] = res
                    if(list.length === ++count) {
                        resolve(result)
                    }
                }).catch(error => reject(error))
            })
        } catch (error) {
            reject(error)
        }
        
    })
}
// 挂在Promise上
Promise.kAll = kAll