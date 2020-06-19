import classNames from "classname";

const els = (v, el) => (isDef(v) ? v : el);
const elsFn = (v, fn) => (isDef(v) ? v : fn());
const isDef = (v) => v !== undefined && v !== null;
const isArr = (v) => isDef(v) && Array.isArray(v);
const isFunc = (v) => isDef(v) && typeof v === "function";
const isStr = (v) => isDef(v) && typeof v === "string";
const isNum = (v) => isDef(v) && typeof v === "number";
const isObj = (v) => isDef(v) && typeof v === "object";

function clamp(min, value, max) {
  return Math.min(Math.max(min, value), max);
}

const getNestedValue = function(reference, path, fallback = undefined) {
  path = isArr(path) ? path : [path];

  var pointer = reference;
  if (isDef(reference)) {
    for (var i = 0, len = path.length; i < len; i++) {
      if (
        typeof pointer !== "string" &&
        pointer !== null &&
        typeof pointer[path[i]] !== "undefined"
      ) {
        pointer = pointer[path[i]];
      } else {
        return fallback;
      }
    }

    if (typeof pointer === "string") {
      pointer = ("" + pointer).trim();
      if (pointer.length === 0) return fallback;
    }
  }
  return pointer;
};

const setNestedValue = function(a, b, c, d) {
  var setter, startingRef, tempPath, value;
  if (typeof a === "function") {
    // Use a custom setter
    setter = a;
    startingRef = b;
    tempPath = c;
    value = d;
  } else {
    // Use Default object syntax to set value.
    setter = (obj, key, val) => {
      obj[key] = val;
    };
    startingRef = a;
    tempPath = b;
    value = c;
  }
  var ref = startingRef;
  if (isDef(ref)) {
    var path = tempPath instanceof Array ? tempPath : [tempPath];
    var lastIndex = path.length - 1;
    var current = 0;
    path.forEach((key) => {
      if (current === lastIndex) {
        setter(ref, key, value);
      } else {
        if (typeof ref[key] === "object" && ref[key] != null) {
          //proceed to next
        } else if (isArr(ref[key])) {
          //proceed to next
        } else {
          var initValue = Number.isNaN(key) ? {} : [];
          setter(ref, key, initValue);
        }
        ref = ref[key];
      }
      ++current;
    });
  }
};

const isDefNested = function(reference, path) {
  return isDef(getNestedValue(reference, path, undefined));
};

// Will return a new object/array with the nested value removed
// Works with objects/arrays
function deleteImmutableValue(ref, _path) {
  let path = Array.isArray(_path) ? _path : [_path];
  if (path.length > 0) {
    let key = path[0];

    // Clone branch
    let sClone;
    if (isArr(ref)) {
      key = parseInt(key, 10);
      sClone = [...ref];
    } else if (isObj(ref)) {
      sClone = { ...ref };
    }

    if (isDef(sClone)) {
      if (path.length === 1) {
        if (isArr(sClone)) {
          let deleteIndex = parseInt(path[0]);
          if (
            !Number.isNaN(deleteIndex) &&
            -1 < deleteIndex &&
            deleteIndex < sClone.length
          ) {
            sClone.splice(deleteIndex, 1);
          }
        } else if (isObj(sClone)) {
          let deleteKey = path[0];
          if (sClone[deleteKey] !== undefined) {
            delete sClone[deleteKey];
          }
        }
      } else {
        let nextPath = path.slice(1);
        sClone[key] = deleteImmutableValue(sClone[key], nextPath);
      }
      return sClone;
    }
    return ref;
  } else {
    return ref;
  }
}

// Returns a new object/array with the nested value added
function setImmutableValue(ref, _path, value) {
  let path = Array.isArray(_path) ? _path : [_path];
  if (path.length > 0) {
    let key = path[0];
    let sClone;
    if (isArr(ref)) {
      key = parseInt(key, 10);
      sClone = [...ref];
    } else if (isObj(ref)) {
      sClone = { ...ref };
    }
    if (isDef(sClone)) {
      let nextPath = path.slice(1);
      sClone[key] = setImmutableValue(sClone[key], nextPath, value);
      return sClone;
    }
    return ref;
  } else {
    return value;
  }
}

// Flatten the mess of classes given as props into a usable attribute
// @usage <div {...classes(["a1", "b1", ["c1", ["d1"]]], "e1", ["f1"])} /> produces <div className={classNames("a1", "b1", "c1", "d1", "e1", "f1")}/>
function classes(...args) {
  let _args = [];
  if (isDef(args)) {
    args.forEach((arg) => {
      if (isDef(arg)) {
        if (isArr(arg)) {
          _args = [..._args, ...arg.flat(0)];
        } else if (isStr(arg)) {
          _args = [..._args, arg];
        }
      }
    });
  }
  return { className: classNames(..._args) };
}

export default {
  isDef,
  isArr,
  isFunc,
  isStr,
  isNum,
  isObj,
  els,
  elsFn,
  clamp,
  classes,
  getNestedValue,
  setNestedValue,
  isDefNested,
  //@TODO checkNested(ref, [path], op, value)
  setImmutableValue,
  deleteImmutableValue,
};
