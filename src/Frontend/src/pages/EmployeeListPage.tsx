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
  Link,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { AppContext } from "../helpers/appContext.tsx";
import axios from "axios";
import { bigButton, StyledTableHeadCell } from "../helpers/stylesVariables";
import { employees_endpoint } from "../helpers/endpoint";
import { employee } from "../helpers/interfaces";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { generateXML } from "../helpers/functions/generateXML";

export default function EmployeeListPage() {
  // const navigate = useNavigate();
  const { setOpenToast, setToastMessage } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [employees, setEmpoyees] = useState<employee[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [xmlURL, setXmlURL] = useState<string | undefined>("");
  const [openModal, setOpenModal] = useState(false);
  const handleModalClose = () => setOpenModal(false);

  // GET DIPENDENTI
  const fetchEmployees = async (name?: string, surname?: string) => {
    setLoading(true);
    try {
      const resp = await axios.get(employees_endpoint, {
        params: {
          FirstName: name,
          LastName: surname,
        },
      });
      setEmpoyees(resp.data as employee[]);
    } catch (error: unknown) {
      setOpenToast(true);
      setToastMessage(
        axios.isAxiosError(error)
          ? error.message
          : "ERRORE chiamata fetchEmployees"
      );
      // navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTRI ----------------

  const fetchFilterEmployees = async () => {
    await fetchEmployees(name.trim(), surname.trim());
    setShowAll(true);
  };

  // reset filtro dipendenti
  const resetFilterEmpolyees = async () => {
    await fetchEmployees();
    setName("");
    setSurname("");
    setShowAll(false);
  };

  // ----------------  XML ----------------

  const generateEmpolyeesXML = () => {
    const data = {
      employees: {
        employee: employees.map((employe) => ({
          id: employe.id,
          firstName: employe.firstName,
          lastName: employe.lastName,
          address: employe.address,
          email: employe.email,
          phone: employe.phone,
          department: {
            code: employe.department?.code,
            description: employe.department?.description,
          },
        })),
      },
    };
    const { xml_url } = generateXML(data);
    if (xml_url) {
      setXmlURL(xml_url);
      setOpenModal(true);
    } else {
      setOpenToast(true);
      setToastMessage("ERRORE nella generazione dell XML");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      {/* FILTRI */}
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
              disabled={showAll}
              aria-label="nome dipendente"
              placeholder="Cerca per nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              disabled={showAll}
              aria-label="cognome dipendente"
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
              disabled={
                (name.trim() === "" && surname.trim() === "") ||
                loading ||
                showAll
              }
            >
              Cerca
            </Button>

            <Button
              variant="contained"
              onClick={resetFilterEmpolyees}
              disabled={!showAll || loading}
            >
              Mostra tutti
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: "green" }}
              disabled={loading || employees.length === 0}
              onClick={generateEmpolyeesXML}
            >
              Genera XML
            </Button>
          </Box>
        </Box>
      </>
      {loading ? (
        <Loading />
      ) : (
        <>
          {showAll && employees.length > 0 && (
            <Alert severity="info" sx={{ marginBottom: 4 }}>
              Risultati per: {name} {surname}
            </Alert>
          )}
          {employees.length === 0 && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              Nessun dipendente trovato.
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
                {employees?.map((row) => (
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

          {/* MODALE PER DOWNLOAD XML */}
          <Modal
            open={openModal}
            close={handleModalClose}
            title="Scarica EMPLOYEES XML"
          >
            <Link
              href={xmlURL}
              download="employees.xml"
              onClick={handleModalClose}
              sx={bigButton}
            >
              DOWNLOAD
            </Link>
          </Modal>
        </>
      )}
    </>
  );
}
