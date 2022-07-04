// 是否函数
exports.isFunction = value => typeof(value) === 'function'
// 是否对象
exports.isObject = value => typeof(value) === 'object' && value !== null
// 是否相等
exports.equal = (p, q) => p === q
// 是否
exports.isIterable = value => value[Symbol.iterator]