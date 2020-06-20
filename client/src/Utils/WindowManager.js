import Utils from "../Utils";
const { els, elsFn, isDef, isArr, getNestedValue, setImmutableValue } = Utils;

function WindowManager(state) {
  let topWindowId = 0;
  const orderItemsPath = ["windows", "orderedItems"];
  const taskbarOrderPath = ["windows", "taskbarOrder"];
  const renderOrderPath = ["windows", "renderOrder"];
  const keyDictionaryPath = ["windows", "keyDictionary"];
  const containerSizePath = ["windows", "containerSize"];

  state.set("windows", {
    containerSize: { width: -1, height: -1 },
    taskbarOrder: [],
    renderOrder: [],
    keyDictionary: {},
    items: {},
  });

  // create a window instance
  function _makeWindow(props) {
    const { children } = props;
    let { key, title } = props;
    let {
      isOpen = false,
      isFocused = false,
      isDragDisabled = false,
      isResizeDisabled = false,
      disablePointerEventsOnBlur = false,
      position = null,
      zIndex = 1,
      size = null,
      actions = null,
    } = props;

    if (isFocused) {
      isOpen = isFocused;
    }
    position = elsFn(position, () => ({
      left: 0,
      top: 0,
    }));
    size = elsFn(size, () => ({
      width: 700,
      height: 700,
    }));

    let id = ++topWindowId;
    key = els(key, `#${id}`);
    return {
      id,
      key,
      title: els(title, `Window #${topWindowId}`),
      isOpen,
      zIndex,
      position,
      size,
      isFocused,
      isDragging: false,
      isResizing: false,
      isDragDisabled,
      isResizeDisabled,
      disablePointerEventsOnBlur,
      isTempDisablePointerEvents: false,
      children,
      actions,
    };
  }

  // create a window and add to manager
  function createWindow(props = {}) {
    let window = _makeWindow(props);
    //window.key
    state.push(orderItemsPath, window);

    state.set(["windows", "items", window.id], window);
    state.set([...keyDictionaryPath, window.key], window.id);
    state.push(taskbarOrderPath, window.id);
    state.push(renderOrderPath, window.id);

    if (props.isFocused) {
      setFocused(window.id, true);
    }
  }

  function removeWindow(id) {
    let window = getWindow(id);
    if (isDef(window)) {
      // Remove taskbar order
      let oldWindowTaskBarOrder = state.get(taskbarOrderPath, []);
      let newWindowTaskBarOrder = oldWindowTaskBarOrder.filter((v) => v !== id);
      state.set(taskbarOrderPath, newWindowTaskBarOrder);

      // Remove render order
      let oldWindowRenderOrder = state.get(renderOrderPath, []);
      let newWindowRenderOrder = oldWindowRenderOrder.filter((v) => v !== id);
      state.set(renderOrderPath, newWindowRenderOrder);

      // Remove from lookups
      state.remove([...keyDictionaryPath, window.key]);

      // Remove window
      state.remove(["windows", "items", id]);
    }
  }

  // Get window or nested value
  function getWindow(id, path = [], fallback = null) {
    let _path = isArr(path) ? path : [path];
    return state.get(["windows", "items", id, ..._path], fallback);
  }

  function getWindowByKey(key) {
    let lookupId = state.get([...keyDictionaryPath, key], null);
    if (isDef(lookupId)) {
      return getWindow(lookupId);
    }
    return null;
  }

  function setValue(id, path, value) {
    let _path = isArr(path) ? path : [path];
    state.set(["windows", "items", id, ..._path], value);
  }

  function setWindow(id, window) {
    state.set(["windows", "items", id], window);
  }

  function getOrderedWindows() {
    let idIndexedWindows = getWindowsKeyed();
    let result = [];
    getTaskbarOrder().forEach((id) => {
      if (isDef(idIndexedWindows[id])) {
        result.push(idIndexedWindows[id]);
      }
    });
    return result;
  }

  function getTaskbarOrder() {
    return state.get(["windows", "taskbarOrder"], []);
  }

  function setTaskbarOrder(value) {
    state.set(["windows", "taskbarOrder"], value);
  }

  function getRenderOrder() {
    return state.get(renderOrderPath, []);
  }

  function getWindowsKeyed() {
    return state.get(["windows", "items"], {});
  }

  // Get windows so frames are not rerendered when reordering taskbar
  function getAllWindows() {
    let items = state.get(["windows", "items"], {});
    return Object.keys(items).map((key) => items[key]);
  }

  function getRenderOrderedWindows() {
    let idIndexedWindows = getWindowsKeyed();
    return getRenderOrder().map((id) => idIndexedWindows[id]);
  }

  function getKey(key) {
    return getOrderedWindows().find((w) => isDef(w.key) && w.key === key);
  }

  function setPosition(id, position) {
    let window = getWindow(id);
    if (isDef(window)) {
      let clonedValue = setImmutableValue(window, "position", {
        ...position,
      });
      setWindow(id, clonedValue);
    }
  }

  function setSize(id, size) {
    let window = getWindow(id);
    if (isDef(window)) {
      let clonedValue = setImmutableValue(window, "size", { ...size });
      setWindow(id, clonedValue);
    }
  }

  function setFocused(id, value = null) {
    let isFocused = !isDef(value) ? true : value;
    if (isFocused) {
      const wasFocused = getWindow(id, "isFocused", false);
      if (!wasFocused) {
        // change the render order
        let foundIndex = getRenderOrder().findIndex((v) => v === id);
        if (foundIndex > -1) {
          let fromPath = [...renderOrderPath, foundIndex];
          let val = state.get(fromPath);
          state.remove(fromPath);
          state.push(renderOrderPath, val);
        }
      }
    }

    let zIndex = 0;
    getRenderOrder().forEach((windowId) => {
      let zi = zIndex++;
      setValue(windowId, "zIndex", zi);
      if (windowId === id) {
        setValue(windowId, "isFocused", isFocused);
        if (isFocused) {
          setValue(id, "isOpen", isFocused);
        }
      } else {
        setValue(windowId, "isFocused", false);
      }
    });
  }

  function toggleWindow(id, forcedToggle = false) {
    let window = getWindow(id);
    if (isDef(window)) {
      const wasOpen = getNestedValue(window, "isOpen", false);
      const wasFocused = getNestedValue(window, "isFocused", false);
      let isOpen = !wasOpen;
      let isFocused;
      if (forcedToggle) {
        isFocused = isOpen;
      } else {
        // Was not open
        if (!wasOpen) {
          isOpen = true;
          isFocused = true;
        }
        // Was open
        else {
          // but was not focused
          if (!wasFocused) {
            isOpen = true;
            isFocused = true;
          } else {
            //open and focused
            isOpen = false;
            isFocused = false;
          }
        }
      }

      setFocused(id, isFocused);
      setValue(id, "isOpen", isOpen);
    }
  }

  function toggleOtherWindowsPointerEvents(id, value = true) {
    getRenderOrder().forEach((windowId) => {
      let window = getWindow(windowId);
      if (windowId !== id) {
        setWindow(
          windowId,
          setImmutableValue(window, "isTempDisablePointerEvents", value)
        );
      }
    });
  }

  function setContainerSize(size) {
    let prevSize = getContainerSize();
    if (size.width !== prevSize.width || size.height !== prevSize.height) {
      state.set(containerSizePath, { ...size });
    }
  }

  function getContainerSize(fallback = { width: -1, height: -1 }) {
    return state.get(containerSizePath, fallback);
  }

  function getState() {
    return state;
  }

  const publicScope = {
    getState,
    createWindow,
    getWindowByKey,
    getWindow,
    setWindow,
    setValue,
    getOrderedWindows,
    getAllWindows,
    getTaskbarOrder,
    setTaskbarOrder,
    getRenderOrder,
    getWindowsKeyed,
    getRenderOrderedWindows,
    getKey,
    setPosition,
    setSize,
    setFocused,
    removeWindow,
    toggleWindow,
    toggleOtherWindowsPointerEvents,
    setContainerSize,
    getContainerSize,
  };

  function getPublic() {
    return publicScope;
  }

  return getPublic();
}

export default WindowManager;
