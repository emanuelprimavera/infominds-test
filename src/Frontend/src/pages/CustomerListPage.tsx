/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../helpers/appContext";
import { customer } from "../helpers/interfaces";
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
  Box,
  Input,
  Button,
  Alert,
  Link,
} from "@mui/material";
import Loading from "../components/Loading";
import { bigButton, StyledTableHeadCell } from "../helpers/stylesVariables";
import { generateXML } from "../helpers/functions/generateXML";
import Modal from "../components/Modal";

export default function CustomerListPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const { setOpenToast, setToastMessage } = useContext(AppContext);
  const [customers, setCustomers] = useState<customer[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [xmlURL, setXmlURL] = useState<string | undefined>("");
  const [openModal, setOpenModal] = useState(false);
  const handleModalClose = () => setOpenModal(false);

  // GET CUSTOMERS
  const fetchCustomers = async (name?: string, email?: string) => {
    setLoading(true);
    try {
      const resp = await axios.get(customers_endpoint, {
        params: {
          Name: name,
          Email: email,
        },
      });
      setCustomers(resp.data as customer[]);
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

  const fetchFilterCustomers = async () => {
    await fetchCustomers(name.trim(), email.trim());
    setShowAll(true);
  };

  // reset filtro dipendenti
  const resetFilterCustomers = async () => {
    await fetchCustomers();
    setName("");
    setEmail("");
    setShowAll(false);
  };

  // ----------------  XML ----------------

  const generateCustomersXML = () => {
    const data = {
      customers: {
        customer: customers?.slice(0, 10).map((customer) => ({
          id: customer.id,
          name: customer.name,
          address: customer.address,
          email: customer.email,
          phone: customer.phone,
          iban: customer.iban,
          category: {
            code: customer.category?.code,
            description: customer.category?.description,
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
    fetchCustomers();
  }, []);

  return (
    <>
      {/* FILTRI */}
      <>
        <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
          Customers
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
              aria-label="nome cliente"
              placeholder="Cerca per nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              disabled={showAll}
              aria-label="email cliente"
              placeholder="Cerca per email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onClick={fetchFilterCustomers}
              disabled={
                (name.trim() === "" && email.trim() === "") ||
                loading ||
                showAll
              }
            >
              Cerca
            </Button>

            <Button
              variant="contained"
              onClick={resetFilterCustomers}
              disabled={!showAll || loading}
            >
              Mostra tutti
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "green" }}
              disabled={loading || customers.length === 0}
              onClick={generateCustomersXML}
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
          {showAll && customers.length > 0 && (
            <Alert severity="info" sx={{ marginBottom: 4 }}>
              Risultati per: {name} {email}
            </Alert>
          )}
          {customers.length === 0 && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              Nessun cliente trovato.
            </Alert>
          )}
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
                      {row.category?.code} {row.category?.description}
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
            title="Scarica CUSTOMERS XML"
          >
            <Link
              href={xmlURL}
              download
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
