import { Container, Snackbar, SnackbarCloseReason } from "@mui/material";
import AppRoutes from "./routing/AppRouter";
import ShellHeader from "./routing/ShellHeader";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContext } from "./helpers/appContext";
import { useState } from "react";

function App() {
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const handleCloseToast = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenToast(false);
  };
  const contextValue = {
    openToast,
    setOpenToast,
    toastMessage,
    setToastMessage,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <CssBaseline />
      <Router>
        <ShellHeader />
        <Container sx={{ pl: 1 }}>
          <AppRoutes />
          <Snackbar
            open={openToast}
            autoHideDuration={3000}
            message={toastMessage}
            onClose={handleCloseToast}
          />
        </Container>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
