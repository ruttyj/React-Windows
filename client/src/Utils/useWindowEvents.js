import React, { useEffect } from "react";

export const useUp = (callback) => {
  useMouseUp(callback);
  useTouchStart(callback);
};

export const useDown = (callback) => {
  useMouseDown(callback);
  useTouchEnd(callback);
};

export const useMouseUp = (callback) => {
  useEffect(() => {
    window.addEventListener("mouseup", callback);
    return () => window.removeEventListener("mouseup", callback);
  }, [callback]);
};

export const useMouseDown = (callback) => {
  useEffect(() => {
    window.addEventListener("mousedown", callback);
    return () => window.removeEventListener("mousedown", callback);
  }, [callback]);
};

export const useTouchStart = (callback) => {
  useEffect(() => {
    window.addEventListener("touchstart", callback);
    return () => window.removeEventListener("touchstart", callback);
  }, [callback]);
};

export const useTouchEnd = (callback) => {
  useEffect(() => {
    window.addEventListener("touchend", callback);
    return () => window.removeEventListener("touchend", callback);
  }, [callback]);
};
