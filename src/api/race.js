import { isIterable } from "../utils";

function race(iterator) {
    return new Promise((resolve, reject) => {
        // 对参数进行校验
        if(!isIterable(iterator)) {
            reject(new TypeError(`${typeof iterator} ${iterator} is not iterable`))
        }

        iterator = Array.from(iterator) 

        for (let i = 0; i < iterator.length; i++) {
            const item = iterator[i];
            Promise.resolve(item).then(resolve).catch(reject)
        }
    })
}