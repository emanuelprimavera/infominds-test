/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container, Snackbar, SnackbarCloseReason } from "@mui/material";
import AppRoutes from "./routing/AppRouter";
import ShellHeader from "./routing/ShellHeader";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContext } from "./helpers/appContext";
import { useContext, useState } from "react";

function App() {
  const { openToast, toastMessage, setOpenToast } = useContext(AppContext);

  // FUNZIONE PER CHIUDERE IL TOAST DI MUI
  const handleCloseToast = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenToast(false);
  };

  return (
    <>
      <CssBaseline />
      <Router>
        <ShellHeader />
        <Container sx={{ pl: 1 }}>
          <AppRoutes />
          <Snackbar
            open={openToast}
            autoHideDuration={2000}
            message={toastMessage}
            onClose={handleCloseToast}
          />
        </Container>
      </Router>
    </>
  );
}

export default App;
