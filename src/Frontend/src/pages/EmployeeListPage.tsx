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
import { useNavigate } from "react-router-dom";
import { AppContext } from "../helpers/appContext";
import axios from "axios";
import Loading from "../components/Loading";
import { StyledTableHeadCell } from "../helpers/variables";
import { employees_endpoint } from "../helpers/endpoint";
import { EmployeeListQuery } from "../helpers/interfaces";
import xml2js from "xml2js";
import Modal from "../components/Modal";

export default function EmployeeListPage() {
  const { setOpenToast, setToastMessage } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [employees, setEmpoyees] = useState<EmployeeListQuery[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [xmlURL, setXmlURL] = useState<string | undefined>("");
  const [openModal, setOpenModal] = useState(false);
  const handleModalClose = () => setOpenModal(false);

  // ---------------- FILTRI ----------------

  // prendo lista dipendenti
  const fetchEmployees = async (name_?: string, surname_?: string) => {
    setLoading(true);
    try {
      const resp = await axios.get(employees_endpoint, {
        params: {
          FirstName: name_,
          LastName: surname_,
        },
      });
      setEmpoyees(resp.data as EmployeeListQuery[]);
    } catch (error: unknown) {
      setOpenToast(true);
      setToastMessage("ERRORE chiamata fetchEmployees");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // chiamata ai dipententi filtrata
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

  const generateXML = () => {
    // istanzio il builder
    const builder = new xml2js.Builder();

    // struttura del documento xml
    const data = {
      employees: {
        employee: employees?.slice(0, 10).map((employe) => ({
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
    // buildo xml come stringa per metterla nel BLOB (il BLOB puo contenere qualsiasi dato binario, in questo caso è una stringa)
    const xmlData = builder.buildObject(data);

    // creo il BLOB
    const blob = new Blob([xmlData], { type: "application/xml" });

    // il browser ha bisogno di un link per scaricare il BLOB quindi lo creo e lo salvo nello state
    setXmlURL(URL.createObjectURL(blob));
    setOpenModal(true);
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
            disabled={loading}
            onClick={generateXML}
          >
            Genera XML
          </Button>
        </Box>
      </Box>

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

          {/* MODALE PER DOWNLOAD XML */}
          <Modal open={openModal} close={handleModalClose} title="Scarica XML">
            <Link
              href={xmlURL}
              download
              onClick={handleModalClose}
              sx={{
                background: "#008000",
                width: "100%",
                display: "inline-block",
                textAlign: "center",
                padding: 2,
                color: "white",
                textDecoration: "none",
              }}
            >
              DOWNLOAD
            </Link>
          </Modal>
        </>
      )}
    </>
  );
}
