/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert } from "@mui/material";
import { memo } from "react";

interface tablemessage {
  showAll: boolean;
  data: any[];
  input_labels: string[];
  tableName: string;
}

const TableMessage = memo((props: tablemessage) => {
  return (
    <div>
      {props.showAll && props.data.length > 0 && (
        <Alert severity="info" sx={{ marginBottom: 4 }}>
          Risultati per:
          {props.input_labels.map((item, index) => {
            return <span key={index}>{item} </span>;
          })}
        </Alert>
      )}
      {props.data.length === 0 && (
        <Alert severity="error" sx={{ marginBottom: 4 }}>
          0 {props.tableName} trovati.
        </Alert>
      )}
    </div>
  );
});

export default TableMessage;
