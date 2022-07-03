import { statusMap } from "../config"
import { isIterable } from "../utils"

function allSettled(iterator) {
    return new Promise((resolve, reject) => {
        if(!isIterable(iterator)) {
            reject(new TypeError(`${typeof iterator} ${iterator} is not iterable`))
        }

        const result = []
        const len = 0
        iterator = Array.from(iterator)

        if(!iterator.length) {
            resolve(result)
        }

        for (let i = 0; i < iterator.length; i++) {
            const item = iterator[i];
            Promise.resolve(item).then(res => {
                result[i] = {
                    status: statusMap.FULFILLED,
                    value: res
                }

                if(++len === iterator.length) {
                    resolve(result)
                }
            }).catch(reason => {
                result[i] = {
                    status: statusMap.REJECTED,
                    value: reason
                }
                if(++len === iterator.length) {
                    resolve(result)
                }
            })
        }
    })
}