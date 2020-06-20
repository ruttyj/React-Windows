import React, { useState } from "react";
import Utils from "./Utils";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import SizeBackgroundColor from "../../../Components/Containers/SizeBackgroundColor/";
import DragListV from "../../../Components/Containers/DragListV/";
import DragListH from "../../../Components/Containers/DragListH/";
import wallpapers from "../../../Data/Wallpapers";
import "./Home.scss";
const { classes } = Utils;

function WindowAComponent(props) {
  const { size, position, containerSize } = props;
  let horizontalItems = {
    0: (
      <div style={{ backgroundColor: "black", padding: "10px", margin: "4px" }}>
        item 0
      </div>
    ),
    1: (
      <div style={{ backgroundColor: "black", padding: "10px", margin: "4px" }}>
        item 1
      </div>
    ),
    2: (
      <div style={{ backgroundColor: "black", padding: "10px", margin: "4px" }}>
        item 2
      </div>
    )
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

            <DragListV />
            <DragListH
              items={horizontalItems}
              order={horizontalOrder}
              setOrder={setHorizontalOrder}
            />
          </div>
        </div>
      </div>
    </SizeBackgroundColor>
  );
}

function createWallpaperWindow(windowManager, isFocused = true) {
  const ChooseWallpaper = props => {
    return (
      <div {...classes("full", "v-fit-content", "wrap")}>
        {wallpapers.map(url => {
          return (
            <div
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                content: "",
                width: "25%",
                height: "150px",
                cursor: "pointer"
              }}
              onClick={() => {
                let state = windowManager.getState();
                state.set(["theme", "wallpaper"], url);
              }}
            >
              .
            </div>
          );
        })}
      </div>
    );
  };

  // Dragable Lists window
  windowManager.createWindow({
    title: "Background Picker",
    key: "backgroundPicker",
    isFocused,
    position: {
      left: 300,
      top: 50
    },
    size: {
      width: 700,
      height: 400
    },
    children: ChooseWallpaper
  });
}

function createWindowA(windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Window A",
    isFocused,
    position: {
      left: 300,
      top: 50
    },
    size: {
      width: 700,
      height: 700
    },
    children: WindowAComponent,
    actions: () => (
      <FillFooter
        height={40}
        classNames={["footer", "actions", "center-center"]}
      >
        <div {...classes("spacer")} />
        <div {...classes("button", "not-allowed")}>Cancel</div>
        <div {...classes("button", "not-allowed")}>Confirm</div>
      </FillFooter>
    )
  });
}

function createTrooperIframe(windowManager, isFocused = true) {
  // Stom trooper dancing iframe
  windowManager.createWindow({
    title: "Trooper - IFrame",
    key: "trooper",
    isFocused,
    disablePointerEventsOnBlur: true,
    position: {
      left: 100,
      top: 50
    },
    size: {
      width: 400,
      height: 600
    },
    children: ({ size, position, containerSize }) => (
      <iframe
        src="https://threejs.org/examples/webgl_loader_collada_skinning.html"
        style={{ height: "100%", width: "100%" }}
      />
    )
  });
}

function createDebugger(windowManager, isFocused = true) {
  // Debuger window
  windowManager.createWindow({
    key: "debugger",
    title: "Debuger",
    isFocused,
    position: {
      left: 1000,
      top: 50
    },
    size: {
      width: 400,
      height: 600
    },
    children: ({ size, position, containerSize }) => (
      <pre {...classes("column", "align-left", "full-width")}>
        <xmp>
          state:
          {JSON.stringify(windowManager.getState().get(), null, 2)}
        </xmp>
      </pre>
    )
  });
}

export {
  createDebugger,
  createTrooperIframe,
  createWindowA,
  createWallpaperWindow
};
