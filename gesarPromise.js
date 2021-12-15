const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
const isPeding = (status) => status === PENDING;
const isFulfilled = (status) => status === FULFILLED;
const isRejected = (status) => status === REJECTED;
class GesarPromise {
  status = PENDING;
  value = undefined;
  callbacks = [];
  constructor(executor) {
    try {
      if (typeof executor !== "function") {
        throw new Error(
          `GesarPromise resolver ${executor} is not a function at new GesarPromise`
        );
      }
      executor.call(this, this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      throw new Error(error);
    }
  }
  resolve(value) {
    if (isPeding(this.status)) {
      this.status = FULFILLED;
      this.value = value;
      this.callbacks.forEach(item => item.onFulfilledCb(value))
    }
  }
  reject(reason) {
    if (isPeding(this.status)) {
      this.status = REJECTED;
      this.value = reason;
      this.callbacks.forEach(item => item.onRejectedCb(reason))
    }
  }
  then(onFulfilledCb, onRejectedCb) {
    console.log(this, "in the then ");
    try {
      if (isPeding(this.status)) {
        this.callbacks.push({ onFulfilledCb, onRejectedCb });
      } else {
        const cb = isFulfilled(this.status) ? onFulfilledCb : onRejectedCb;
        setTimeout(() => cb(this.value));
      }
    } catch (error) {
      setTimeout(() => onRejectedCb(error));
    }
  }
  catch(onRejectedCb) {
    if (isRejected(this.status)) {
      try {
        onRejectedCb(this.value);
      } catch (error) {
        onRejectedCb(error);
      }
    }
  }
}
