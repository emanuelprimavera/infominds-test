/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useState } from "react";
import { appContext } from "./interfaces";

export const AppContext = createContext<appContext>({
  openToast: false,
  setOpenToast: () => {},
  toastMessage: "",
  setToastMessage: () => {},
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const contextValue = {
    openToast,
    setOpenToast,
    toastMessage,
    setToastMessage,
  };
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
