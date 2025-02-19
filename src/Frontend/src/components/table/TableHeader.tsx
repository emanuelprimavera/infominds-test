/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Input, Button } from "@mui/material";
import React, { memo } from "react";

interface tableHeader {
  inputs: input[];
  buttons: button[];
}

interface input {
  id: number;
  disabled: boolean;
  aria_label: string;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
}
interface button {
  id: number;
  label: React.ReactNode;
  bg?: string;
  disabled: boolean;
  onClick: () => void;
}

const TableHeader = memo((props: tableHeader) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
        "@media (max-width:780px)": {
          display: "block",
        },
      }}
    >
      <Box
        sx={{
          gap: 6,
          display: "flex",
          alignItems: "center",
          "@media (max-width:780px)": {
            marginBottom: "20px",
          },
        }}
      >
        {props.inputs.map((item) => {
          return (
            <Input
              key={item.id}
              disabled={item.disabled}
              aria-label="nome cliente"
              placeholder={item.placeholder}
              value={item.value}
              onChange={item.onChange}
            />
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        {props.buttons.map((item) => {
          return (
            <div key={item.id}>
              <Button
                variant="contained"
                onClick={item.onClick}
                disabled={item.disabled}
                sx={{ background: item.bg ? item.bg : null }}
              >
                {item.label}
              </Button>
            </div>
          );
        })}
      </Box>
    </Box>
  );
});

export default TableHeader;
