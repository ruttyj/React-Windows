import classNames from "classname";

const els = (v, el) => (isDef(v) ? v : el);
const isDef = (v) => v !== undefined && v !== null;
const isArr = (v) => isDef(v) && Array.isArray(v);
const isFunc = (v) => isDef(v) && typeof v === "function";
const isStr = (v) => isDef(v) && typeof v === "string";
const isNum = (v) => isDef(v) && typeof v === "number";
const isObj = (v) => isDef(v) && typeof v === "object";

const getNestedValue = function (reference, path, fallback = undefined) {
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

const setNestedValue = function (a, b, c, d) {
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

const isDefNested = function (reference, path) {
  return isDef(getNestedValue(reference, path, undefined));
};

const deleteNestedValue = function (a, b, c) {
  var deleter;
  var startingRef;
  var tempPath;
  if (typeof a === "function") {
    deleter = a;
    startingRef = b;
    tempPath = c;
  } else {
    deleter = (r, k) => {
      delete r[k];
    }; // standard delete syntax
    startingRef = a;
    tempPath = b;
  }
  var ref = startingRef;
  var path = tempPath instanceof Array ? tempPath : [tempPath];
  var lastIndex = path.length - 1;
  var current = 0;
  path.forEach((key) => {
    if (current === lastIndex) {
      deleter(ref, key);
    } else {
      ref = ref[key];
    }
    ++current;
  });
};

function setImmutableValue(ref, _path, value) {
  let path = Array.isArray(_path) ? _path : [_path];
  if (path.length > 0) {
    let sClone = { ...ref };
    let key = path[0];
    let nextPath = path.slice(1);
    sClone[key] = setImmutableValue(sClone[key], nextPath, value);
    return sClone;
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
  classes,
  getNestedValue,
  setNestedValue,
  deleteNestedValue,
  isDefNested,
  setImmutableValue,
  deleteNestedValue,
};
