export default function race(iteratories) {
  return new Promise((resolve, reject) => {
    try {
      if (!iteratories[Symbol.iterator]) {
        reject(new TypeError(`${typeof iteratories} is not a iterable`));
      }
      iteratories = Array.from(iteratories);
      iteratories.forEach((item) =>
        Promise.resolve(item).then(resolve).catch(reject)
      );
    } catch (error) {
      reject(error);
    }
  });
}

Promise.myRace = race;

const p1 = Promise.resolve("king");
const p2 = new Promise((resolve) => setTimeout(resolve, 3000, "p2: 3000"));
const p3 = new Promise((resolve) => setTimeout(resolve, 0, "p3: 0"));
// const p4 = Promise.reject('p4: error')
const p5 = new Set(["promise", {}, NaN, null, undefined]);
const p6 = new Set([
  [{}, {}],
  ["name", "king"],
  [[], []],
]);

const p = [] ?? p6 ?? p5 ?? [p1, p2, p3];
const custom = Promise.myRace(p);
const native = Promise.race(p);

console.log("custom: ", custom, "native: ", native);
