/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { suppliers_endpoint } from "../helpers/endpoint";
import Loading from "../components/Loading";
import { AppContext } from "../helpers/appContext";
import { SupplierListQuery } from "../helpers/interfaces";
import { StyledTableHeadCell } from "../helpers/stylesVariables";
import { useNavigate } from "react-router-dom";

export default function SupplierListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { setOpenToast, setToastMessage } = useContext(AppContext);
  const [list, setList] = useState<SupplierListQuery[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const resp = await axios.get(suppliers_endpoint);
        setList(resp.data as SupplierListQuery[]);
      } catch (error: unknown) {
        setOpenToast(true);
        setToastMessage("ERRORE chiamata fetchSuppliers");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Suppliers
      </Typography>
      {loading ? (
        <Loading />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>Name</StyledTableHeadCell>
                <StyledTableHeadCell>Address</StyledTableHeadCell>
                <StyledTableHeadCell>Email</StyledTableHeadCell>
                <StyledTableHeadCell>Phone</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
