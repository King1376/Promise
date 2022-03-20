export default function all(iteratories) {
    return new Promise((resolve, reject) => {
        try {
            if(!iteratories[Symbol.iterator]) {
                reject(new TypeError(`${typeof iteratories} is not a iterable`))
            }
            const result = []
            let count = 0
            iteratories = Array.from(iteratories)
            if(!iteratories.length) {
                resolve(result)
            }
            iteratories.forEach((item, index) => {
                Promise.resolve(item).then(data => {
                   result[index] = data
                   if(++count === iteratories.length) {
                       resolve(result)
                   }
                }).catch(reject)
            })
        } catch (error) {
            reject(error)
        }
    })
}
Promise.myAll = all

const p1 = Promise.resolve('king')
const p2 = new Promise(resolve => setTimeout(resolve, 3000, 'p2: 3000'))
const p3 = new Promise(resolve => setTimeout(resolve, 0, 'p3: 0'))
// const p4 = Promise.reject('p4: error')
const p5 = new Set(['promise', {}, NaN, null, undefined])
const p6 = new Set([[{}, {}], ['name', 'king'], [[], []]])

const p = p6 ?? p5 ?? [p1, p2, p3, p4]
const custom = Promise.myAll(p)
const native = Promise.all(p)

console.log('custom: ', custom, 'native: ', native);