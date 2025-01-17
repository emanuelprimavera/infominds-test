/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../helpers/appContext";
import { CustomersListQuery, SupplierListQuery } from "../helpers/interfaces";
import { customers_endpoint } from "../helpers/endpoint";
import axios from "axios";
import {
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import Loading from "../components/Loading";
import { StyledTableHeadCell } from "../helpers/stylesVariables";

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { setOpenToast, setToastMessage } = useContext(AppContext);
  const [customers, setCustomers] = useState<CustomersListQuery[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const resp = await axios.get(customers_endpoint);
        setCustomers(resp.data as CustomersListQuery[]);
      } catch (error: unknown) {
        setOpenToast(true);
        setToastMessage("ERRORE chiamata fetchCustomers");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Customers
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
                <StyledTableHeadCell>Iban</StyledTableHeadCell>
                <StyledTableHeadCell>Category</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers?.slice(0, 10).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.iban}</TableCell>
                  <TableCell>
                    {row.category.code} {row.category.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
