# Promise.all
- 1. 参数必须是可迭代对象，如 Array 、Map 、Set
- 2. 返回一个Promise对象，值为一数组
- 3. 若参数的每一项不是一个Promise实例，则通过Promise.resolve来新建一个状态为
    fulfilled的Promise实例
- 4. 只要有一个Promise实例失败，则它的结果也是失败的
- 5. 返回的Promise实例数组不是按照Promise实例完成的顺序，而是参数的顺序返回的
