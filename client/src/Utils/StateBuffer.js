import { debounce } from "lodash";
import arraySwap from "array-move";

import Utils from "../Utils/";

const {
  isDef,
  isDefNested,
  isArr,
  isObj,
  isFunc,
  inRange,
  getNestedValue,
  setImmutableValue,
  deleteImmutableValue,
} = Utils;

const identity = (v) => v;

//#######################################################

//                     STATE BUFFER

//#######################################################
export default function StateBuffer(_initialState = {}) {
  const initialState = _initialState;
  let mIsNotValid = true;
  let mCurrentState = initialState;

  let mSetter = null;
  let mMutator = (v) => v;
  const _flush = debounce(async function() {
    flush(mSetter);
  }, 1);

  function setSetter(f) {
    mSetter = f;
  }
  function setMutator(m) {
    mMutator = m;
  }

  function toggle(path = [], value) {
    mCurrentState = setImmutableValue(mCurrentState, path, !get(path, false));
    _flush();
  }

  function inc(path = [], value = 1) {
    mCurrentState = setImmutableValue(
      mCurrentState,
      path,
      parseFloat(get(path, 0)) + value
    );
    _flush();
  }

  function dec(path = [], value = 1) {
    mCurrentState = setImmutableValue(
      mCurrentState,
      path,
      parseFloat(get(path, 0)) - value
    );
    _flush();
  }

  function push(path = [], value = undefined) {
    if (value !== undefined) {
      let pointer = getNestedValue(mCurrentState, path, undefined);
      let newValue = pointer;
      if (isArr(pointer)) {
        newValue = [...pointer, value];
      } else {
        newValue = [value];
      }
      mCurrentState = setImmutableValue(mCurrentState, path, newValue);
    } else {
      // You mean delete right, or keep same value?????
    }
    _flush();
  }

  function swap(path = [], key1, key2) {
    let pointer = getNestedValue(mCurrentState, path, undefined);
    if (isDef(pointer)) {
      if (isArr(pointer)) {
        let newValue = [...pointer];
        let index1 = parseInt(key1, 10);
        let index2 = parseInt(key2, 10);
        if (
          inRange(0, index1, newValue.length) &&
          inRange(0, index1, newValue.length)
        ) {
          let temp1 = getNestedValue(pointer, index1);
          let temp2 = getNestedValue(pointer, index2);
          newValue = setImmutableValue(newValue, index1, temp2);
          newValue = setImmutableValue(newValue, temp2, temp1);
          mCurrentState = setImmutableValue(mCurrentState, path, newValue);
        }
      }
    } else if (isObj(pointer)) {
      let newValue = { ...pointer };
      if (isDef(pointer[key1]) && isDef(pointer[key2])) {
        let temp1 = getNestedValue(pointer, key1);
        let temp2 = getNestedValue(pointer, key2);
        newValue = setImmutableValue(newValue, key1, temp2);
        newValue = setImmutableValue(newValue, key2, temp1);
        mCurrentState = setImmutableValue(mCurrentState, path, newValue);
      }
    }

    console.log("mCurrentState", mCurrentState);
  }

  function remove(path = []) {
    if (isStateDefNested(path)) {
      mCurrentState = deleteImmutableValue(mCurrentState, path);
      _flush();
    }
  }

  function forEach(path = [], fn = identity) {
    let iterable = getNestedValue(mCurrentState, path, []);
    if (isDef(iterable)) {
      if (isArr(iterable) || isFunc(iterable.map)) {
        iterable.forEach(fn);
      } else if (isFunc(iterable.forEach)) {
        iterable.forEach((item, key, whole) => {
          fn(item, key, whole);
        });
      } else if (isObj(iterable)) {
        let keys = Object.keys(iterable);
        if (keys.length > 0) {
          return keys.map((key) => {
            let value = iterable[key];
            fn(value, key, iterable);
          });
        }
      }
    }
  }

  function isStateDefNested(path) {
    return isDefNested(mCurrentState, path, false);
  }

  function is(A, B = undefined, C = undefined) {
    let path, op, value;

    if (isDef(A) && !isDef(B) && !isDef(C)) {
      path = A;
      op = "===";
      value = true;
    } else {
      if (isDef(A) && isDef(B) && !isDef(C)) {
        path = A;
        op = "===";
        value = B;
      } else if (isDef(A) && isDef(B) && isDef(C)) {
        path = A;
        op = B;
        value = C;
      }
    }

    let nestedVal = get(path);
    switch (op) {
      case "===":
        return nestedVal === value;
      default:
        return nestedVal === op;
    }
  }

  function map(path = [], fn = identity) {
    let result = [];
    forEach(path, (...props) => {
      result.push(fn(...props));
    });
    return result;
  }

  function set(path = [], value) {
    mCurrentState = setImmutableValue(mCurrentState, path, value);
    _flush();
  }

  function flush() {
    if (isDef(mSetter)) {
      mSetter(mMutator(mCurrentState));
    }
  }

  function getState() {
    return mCurrentState;
  }

  function get(path = [], fallback) {
    return getNestedValue(mCurrentState, path, fallback);
  }

  const publicScope = {
    // check wither value exists or matches some condition
    is, // is truthy
    isDef: isStateDefNested, // is not null or undefiend

    // If is boolean, toggle value
    // @TODO If array item toggle it's existance
    // @TODO If object - undefined
    toggle,

    // If the path points top a number, manipulate in some way
    inc,
    dec,
    get,
    set,

    // if path points to array, push value
    push,
    swap,
    remove,

    // For each value at the path do something
    map,
    forEach,

    flush,
    getState,
    setSetter,
    setMutator,
  };

  function getPublic() {
    return publicScope;
  }

  return getPublic();
}
