/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Input,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../helpers/appContext";
import axios from "axios";
import Loading from "../components/Loading";
import { StyledTableHeadCell } from "../helpers/variables";
import { employees_endpoint } from "../helpers/endpoint";
import { EmployeeListQuery } from "../helpers/interfaces";

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [employees, setEmpoyees] = useState<EmployeeListQuery[]>([]);
  const { setOpenToast, setToastMessage } = useContext(AppContext);

  interface fetchEmployees {
    name_?: string;
    surname_?: string;
  }

  const fetchEmployees = async (name_?: string, surname_?: string) => {
    setLoading(true);
    try {
      const resp = await axios.get(employees_endpoint, {
        params: {
          FirstName: name_,
          LastName: surname_,
        },
      });
      console.log(resp.data);
      setEmpoyees(resp.data as EmployeeListQuery[]);
    } catch (error: unknown) {
      console.log(error);
      setOpenToast(true);
      setToastMessage("ERRORE chiamata fetchEmployees");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterEmployees = async () => {
    await fetchEmployees(name.trim(), surname.trim());
  };

  const resetFilterEmpolyees = async () => {
    await fetchEmployees();
    setName("");
    setSurname("");
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Employees
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Box
          sx={{
            gap: 6,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            aria-label="nome impiegato"
            placeholder="Cerca per nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            aria-label="cognome impiegato"
            placeholder="Cerca per cognome"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={fetchFilterEmployees}
            disabled={(name.trim() === "" && surname.trim() === "") || loading}
          >
            Cerca
          </Button>

          <Button
            variant="contained"
            onClick={resetFilterEmpolyees}
            disabled={loading}
          >
            Mostra tutti
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "green" }}
            disabled={loading}
          >
            Scarica EXCEL
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Loading />
      ) : (
        <>
          {employees.length === 0 && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              Nessun impiegato trovato.
            </Alert>
          )}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>First Name</StyledTableHeadCell>
                  <StyledTableHeadCell>Last Name</StyledTableHeadCell>
                  <StyledTableHeadCell>Address</StyledTableHeadCell>
                  <StyledTableHeadCell>Email</StyledTableHeadCell>
                  <StyledTableHeadCell>Phone</StyledTableHeadCell>
                  <StyledTableHeadCell>Department</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees?.slice(0, 10).map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>
                      {row.department &&
                        row.department.code +
                          " - " +
                          row.department.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
