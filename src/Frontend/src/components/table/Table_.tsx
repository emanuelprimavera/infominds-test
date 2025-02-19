/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Box,
} from "@mui/material";
import { StyledTableHeadCell } from "../../helpers/stylesVariables";
import { memo } from "react";

interface table {
  labels: string[];
  data: any[];
}

const Table_ = memo(({ labels, data }: table) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {labels.map((label, index: number) => {
              return (
                <StyledTableHeadCell key={index}>{label}</StyledTableHeadCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => {
            // console.log("row", row);
            return (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {labels.map((item, index: number) => {
                  if (typeof row[item] === "object" && row[item]) {
                    return (
                      <TableCell key={index}>
                        {Object.keys(row[item]).map((item2, index) => {
                          return <span key={index}>{row[item][item2]} </span>;
                        })}
                      </TableCell>
                    );
                  } else return <TableCell key={index}>{row[item]}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default Table_;
