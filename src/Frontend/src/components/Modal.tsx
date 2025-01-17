/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography, Modal as MuiModal } from "@mui/material";
import { modalStyle } from "../helpers/variables";
import { ModalInterface } from "../helpers/interfaces";

const Modal = (props: ModalInterface) => {
  return (
    <MuiModal
      open={props.open}
      onClose={props.close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: "center", marginBottom: 3 }}
        >
          {props.title}
        </Typography>
        <Box>
          <Typography id="modal-modal-description">{props.children}</Typography>
        </Box>
      </Box>
    </MuiModal>
  );
};
export default Modal;
