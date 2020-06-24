import React, { useState, useEffect } from "react";
import Utils from "./Utils";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@material-ui/icons/Add";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import DragWindow from "../../../Components/Containers/Windows/DragWindow/";
import WindowContainer from "../../../Components/Containers/Windows/WindowContainer/";
import DragListH from "../../../Components/Containers/DragListH/";
import StateBuffer from "../../../Utils/StateBuffer";
import BlurredWrapper from "../../Containers/BlurredWrapper/";
import AppSidebar from "../../../Components/TopLevel/AppSizebar/";
import AppHeader from "../../../Components/TopLevel/AppHeader/";
import WindowManager from "../../../Utils/WindowManager";
import BugReportIcon from "@material-ui/icons/BugReport";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import ArrowToolTip from "../../../Components/Containers/ArrowToolTip/";
import wallpapers from "../../../Data/Wallpapers";
import PhotoSizeSelectActualIcon from "@material-ui/icons/PhotoSizeSelectActual";
import TextField from "@material-ui/core/TextField";
import PublicIcon from "@material-ui/icons/Public";
import {
  createDebugger,
  createTrooperIframe,
  createWindowA,
  createWallpaperWindow,
} from "./CreateWindow";
import "./Home.scss";

export {
  React,
  useState,
  useEffect,
  Utils,
  motion,
  AnimatePresence,
  AddIcon,
  FillContainer,
  FillContent,
  FillHeader,
  FillFooter,
  DragWindow,
  WindowContainer,
  DragListH,
  StateBuffer,
  BlurredWrapper,
  AppSidebar,
  AppHeader,
  WindowManager,
  BugReportIcon,
  EmojiPeopleIcon,
  ArrowToolTip,
  wallpapers,
  PhotoSizeSelectActualIcon,
  TextField,
  PublicIcon,
  createDebugger,
  createTrooperIframe,
  createWindowA,
  createWallpaperWindow,
};
