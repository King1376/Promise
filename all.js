function promiseAall(iterable) {
    return new Promise((resolve, reject) => {
        try {
            const list = [ ...iterable ],
                  result = [];
            let count = 0
            if(!list.length){
                return result
            }
            list.forEach((item, idx) => {
                Promise.resolve(item).then(res => {
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
Promise.promiseAll = promiseAall