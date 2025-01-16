/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import { appContext } from "./interfaces";

export const AppContext = createContext<appContext>({
  openToast: false,
  setOpenToast: () => {},
  toastMessage: "",
  setToastMessage: () => {},
});
