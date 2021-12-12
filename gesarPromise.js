const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const isPeding = status => status === PENDING
class GesarPromise {
    status = PENDING
    value = undefined
    constructor(excutor) {
        try {
            excutor.call(this,this.resolve.bind(this), this.reject.bind(this))           
        } catch (error) {
            throw new Error(`GesarPromise resolver ${excutor} is not a function at new GesarPromise`)
        }
    }
    resolve(value){
      if(isPeding(this.status)) {
        this.status = FULFILLED
        this.value = value
      }
    }
    reject(reason){
      if(isPeding(this.status)) {
        this.status = REJECTED
        this.value = reason
      }
    }
}