// 是否函数
export const isFunction = value => typeof(value) === 'function'
// 是否对象
export const isObject = value => typeof(value) === 'object' && value !== null
// 是否相等
export const equal = (p, q) => p === q
// 是否
export const isIterable = value => value[Symbol.iterator]