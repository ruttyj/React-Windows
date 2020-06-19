import Utils from "../Utils";

const {
  els,
  elsFn,
  isDef,
  isArr,
  isFunc,
  getNestedValue,
  classes,
  setImmutableValue,
  deleteImmutableValue,
} = Utils;
let topWindowId = 0;

function WindowManager(state) {
  const windowOrderItemsPath = ["windows", "orderedItems"];
  const windowTaskbarOrderPath = ["windows", "taskbarOrder"];
  const windowRenderOrderPath = ["windows", "zIndexOrder"];

  // create a window instance
  function _makeWindow(props) {
    const { children } = props;
    let { key, title } = props;

    let {
      isOpen = false,
      isFocused = false,
      isDragDisabled = false,
      isResizeDisabled = false,
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
      children,
      actions,
    };
  }

  // create a window and add to manager
  function createWindow(props = {}) {
    let window = _makeWindow(props);
    //window.key
    state.push(windowOrderItemsPath, window);

    state.set(["windows", "items", window.id], window);
    state.push(windowTaskbarOrderPath, window.id);
    state.push(windowRenderOrderPath, window.id);

    if (props.isFocused) {
      setFocused(window.id, true);
    }
  }

  function get(id, path = [], fallback = null) {
    let _path = isArr(path) ? path : [path];
    return state.get(["windows", "items", id, ..._path], fallback);
  }

  function setValue(id, path, value) {
    let _path = isArr(path) ? path : [path];
    state.set(["windows", "items", id, ..._path], value);
  }

  function set(id, window) {
    state.set(["windows", "items", id], window);
  }

  function getOrderedWindows() {
    let idIndexedWindows = getWindowsKeyed();
    return getTaskbarOrder().map((id) => idIndexedWindows[id]);
  }

  function getTaskbarOrder() {
    return state.get(["windows", "taskbarOrder"], []);
  }

  function getZIndexOrder() {
    return state.get(windowRenderOrderPath, []);
  }

  function getWindowsKeyed() {
    return state.get(["windows", "items"], {});
  }

  function getZIndexOrderedWindows() {
    let idIndexedWindows = getWindowsKeyed();
    return getZIndexOrder().map((id) => idIndexedWindows[id]);
  }

  function getKey(key) {
    return getOrderedWindows().find((w) => isDef(w.key) && w.key === key);
  }

  function setPosition(id, position) {
    let window = get(id);
    if (isDef(window)) {
      let clonedValue = setImmutableValue(window, "position", {
        ...position,
      });
      set(id, clonedValue);
    }
  }

  function setSize(id, size) {
    let window = get(id);
    if (isDef(window)) {
      let clonedValue = setImmutableValue(window, "size", { ...size });
      set(id, clonedValue);
    }
  }

  function setState(id, newState) {
    set(id, newState);
  }

  function setFocused(id, value = null) {
    let isFocused = !isDef(value) ? true : value;
    if (isFocused) {
      const wasFocused = get(id, "isFocused", false);
      if (!wasFocused) {
        // change the render order
        let foundIndex = getZIndexOrder().findIndex((v) => v === id);
        if (foundIndex > -1) {
          let fromPath = [...windowRenderOrderPath, foundIndex];
          let val = state.get(fromPath);
          state.remove(fromPath);
          state.push(windowRenderOrderPath, val);
        }
      }
    }

    let zIndex = 0;
    getZIndexOrder().forEach((windowId) => {
      let zi = zIndex++;
      setValue(windowId, "zIndex", zi);
      if (windowId !== id) {
        setValue(id, "isFocused", false);
      }
    });
  }

  function removeWindow(id) {
    // Remove task bar order
    let oldWindowTaskBarOrder = state.get(windowTaskbarOrderPath, []);
    let newWindowTaskBarOrder = oldWindowTaskBarOrder.filter((v) => v !== id);
    state.set(windowTaskbarOrderPath, newWindowTaskBarOrder);

    // Remove render order
    let oldWindowRenderOrder = state.get(windowRenderOrderPath, []);
    let newWindowRenderOrder = oldWindowRenderOrder.filter((v) => v !== id);
    state.set(windowRenderOrderPath, newWindowRenderOrder);

    // Remove window
    state.remove(["windows", "items", id]);
  }

  function toggleWindow(id, forcedToggle = false) {
    let window = get(id);
    let newValue = getOrderedWindows();
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

      newValue = setFocused(id, isFocused);
      setValue(id, "isOpen", isOpen);
    }
  }

  const publicScope = {
    createWindow,
    get,
    set,
    setValue,
    getOrderedWindows,
    getTaskbarOrder,
    getTaskbarOrder,
    getZIndexOrder,
    getWindowsKeyed,
    getZIndexOrderedWindows,
    getKey,
    setPosition,
    setSize,
    setState,
    setFocused,
    removeWindow,
    toggleWindow,
  };

  function getPublic() {
    return publicScope;
  }

  return getPublic();
}

export default WindowManager;
