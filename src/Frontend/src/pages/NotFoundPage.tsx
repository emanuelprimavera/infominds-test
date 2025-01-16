import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <Box
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: "15px" }}>
          Pagina non trovata.
        </Typography>
        <Link to="/">
          <Button variant="contained">torna alla home</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
