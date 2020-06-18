import React, { useEffect } from "react";

export const useMouseUp = (callback) => {
  useEffect(() => {
    window.addEventListener("mouseup", callback);
    return () => window.removeEventListener("mouseup", callback);
  }, [callback]);
};

export const useTouchEnd = (callback) => {
  useEffect(() => {
    window.addEventListener("touchend", callback);
    return () => window.removeEventListener("touchend", callback);
  }, [callback]);
};
