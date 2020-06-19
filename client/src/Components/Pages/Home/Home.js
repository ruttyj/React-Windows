import React, { useState, useEffect } from "react";
import Utils from "./Utils";
import { AnimatePresence } from "framer-motion";
import AddIcon from "@material-ui/icons/Add";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import DragWindow from "../../../Components/Containers/Windows/DragWindow/";
import WindowContainer from "../../../Components/Containers/Windows/WindowContainer/";
import SizeBackgroundColor from "../../../Components/Containers/SizeBackgroundColor/";
import DragListV from "../../../Components/Containers/DragListV/";
import DragListH, { sample } from "../../../Components/Containers/DragListH/";
import StateBuffer from "../../../Utils/StateBuffer";
import BlurredWrapper from "../../Containers/BlurredWrapper/";
import AppSidebar from "../../../Components/TopLevel/AppSizebar/";
import AppHeader from "../../../Components/TopLevel/AppHeader/";
import WindowManager from "../../../Utils/WindowManager";
import "./Home.scss";

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

function WindowAComponent(props) {
  const { size, position, containerSize } = props;
  let horizontalItems = {
    0: <div>item 0</div>,
    1: <div>item 1</div>,
    2: <div>item 2</div>,
  };

  let _horizontalOrder = [0, 1, 2];
  const [horizontalOrder, setHorizontalOrder] = useState(_horizontalOrder);

  return (
    <SizeBackgroundColor>
      <div {...classes("body", "grow")}>
        <div {...classes("grow")}>
          <div {...classes("column")}>
            <div {...classes("row")}>
              <div {...classes("column", "align-left")}>
                size:{" "}
                <pre style={{ padding: "100px" }}>
                  <xmp>{JSON.stringify(size, null, 2)}</xmp>
                </pre>
              </div>
              <div {...classes("column", "align-left")}>
                position:
                <pre style={{ padding: "100px" }}>
                  <xmp>{JSON.stringify(position, null, 2)}</xmp>
                </pre>
              </div>
            </div>
            <DragListH
              items={horizontalItems}
              order={horizontalOrder}
              setOrder={setHorizontalOrder}
            />
            <DragListV></DragListV>
          </div>
        </div>
      </div>
    </SizeBackgroundColor>
  );
}

const initialState = {
  windows: {
    taskbarOrder: [],
    zIndexOrder: [],
    orderedItems: [],
    items: {},
  },
};

const state = StateBuffer(initialState);
const windowManager = WindowManager(state);

// Dragable Lists window
windowManager.createWindow({
  title: "Window A",
  isOpen: false,
  position: {
    left: 300,
    top: 50,
  },
  size: {
    width: 700,
    height: 700,
  },
  children: WindowAComponent,
  actions: () => (
    <FillFooter height={40} classNames={["footer", "actions", "center-center"]}>
      <div {...classes("spacer")} />
      <div {...classes("button", "not-allowed")}>Cancel</div>
      <div {...classes("button", "not-allowed")}>Confirm</div>
    </FillFooter>
  ),
});

// Stom trooper dancing iframe
windowManager.createWindow({
  title: "Trooper - IFrame",
  isOpen: false,
  isFocused: false,
  position: {
    left: 1000,
    top: 50,
  },
  size: {
    width: 400,
    height: 600,
  },
  disablePointerEventsOnBlur: true,
  children: ({ size, position, containerSize }) => (
    <iframe
      src="https://threejs.org/examples/webgl_loader_collada_skinning.html"
      style={{ height: "100%", width: "100%" }}
    />
  ),
});

// Debuger window
windowManager.createWindow({
  id: ++topWindowId,
  title: "Debuger",
  isFocused: true,
  position: {
    left: 1000,
    top: 50,
  },
  size: {
    width: 400,
    height: 600,
  },
  children: ({ size, position, containerSize }) => (
    <pre {...classes("column", "align-left", "full-width")}>
      <xmp>
        state:
        {JSON.stringify(state.get(), null, 2)}
      </xmp>
    </pre>
  ),
});

function Home(props) {
  const [isLeftSnapIndicator, setIsLeftSnapIndicator] = useState(false);
  const [_state, _setState] = useState(state.get());
  state.setSetter(_setState);

  const onSnapEnter = (window, key = "w") => {
    if (!isLeftSnapIndicator) setIsLeftSnapIndicator(true);
  };

  const onSnapLeave = (window, key = "w") => {
    if (isLeftSnapIndicator) setIsLeftSnapIndicator(false);
  };

  const addWindow = () => {
    windowManager.createWindow({
      isFocused: true,
      title: "Drag and Drop Grids - IFrame",
      children(props) {
        const { size, position } = props;
        //const {state} = props;
        //@TODO const state.set("")

        return (
          <iframe
            {...classes(["full"])}
            style={{
              "background-color": "white",
            }}
            src={`https://csb-7svhq-7wti992fk.vercel.app/`}
          />
        );
      },
    });
  };

  return (
    <div {...classes("full", "row", "main_bkgd")}>
      <AppSidebar>
        <div {...classes("button")} onClick={() => addWindow()}>
          <AddIcon />
        </div>
      </AppSidebar>
      <FillContainer>
        <FillHeader>
          <AppHeader />
        </FillHeader>
        <FillContent>
          <WindowContainer
            leftIndicator={isLeftSnapIndicator}
            children={({ containerSize }) => (
              <>
                {windowManager.getOrderedWindows().map((window) => {
                  let contents = "";
                  if (window.isOpen) {
                    contents = (
                      <DragWindow
                        window={window}
                        onSet={(path, value) =>
                          windowManager.setWindow(
                            window.id,
                            setImmutableValue(window, path, value)
                          )
                        }
                        onSetState={(...args) =>
                          windowManager.setWindow(window.id, ...args)
                        }
                        onSetSize={(...args) =>
                          windowManager.setSize(window.id, ...args)
                        }
                        onSetPosition={(...args) => {
                          windowManager.setPosition(window.id, ...args);
                        }}
                        onClose={() => windowManager.removeWindow(window.id)}
                        onSnapEnter={onSnapEnter}
                        onSnapLeave={onSnapLeave}
                        onToggleWindow={() =>
                          windowManager.toggleWindow(window.id, true)
                        }
                        onSetFocus={(value) =>
                          windowManager.setFocused(window.id, value)
                        }
                        title={window.title}
                        containerSize={containerSize}
                        children={window.children}
                        actions={window.actions}
                      />
                    );
                  }
                  return (
                    <AnimatePresence key={window.id}>
                      {contents}
                    </AnimatePresence>
                  );
                })}
              </>
            )}
          />
        </FillContent>
        <FillFooter height={60}>
          <div {...classes("full")}>
            <BlurredWrapper>
              <div {...classes("taskbar", "full", "tinted-dark")}>
                {windowManager.getOrderedWindows().map((window) => {
                  let outterClasses = [];
                  if (window.isOpen) outterClasses.push("open");
                  if (window.isFocused) outterClasses.push("focused");

                  return (
                    <div
                      {...classes("button", "noselect", outterClasses)}
                      key={window.id}
                      onClick={() => windowManager.toggleWindow(window.id)}
                    >
                      <div {...classes("truncate-inner")} key={window.id}>
                        {window.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </BlurredWrapper>
          </div>
        </FillFooter>
      </FillContainer>
    </div>
  );
}

export default Home;
