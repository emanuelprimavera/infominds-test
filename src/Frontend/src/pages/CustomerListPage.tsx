/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../helpers/appContext.tsx";
import { customer } from "../helpers/interfaces";
import { customers_endpoint } from "../helpers/endpoint";
import axios from "axios";
import { Typography, Link } from "@mui/material";
import Loading from "../components/Loading";
import { bigButton } from "../helpers/stylesVariables";
import { generateXML } from "../helpers/functions/generateXML";
import Modal from "../components/Modal";
import Table_ from "../components/table/Table_";
import TableHeader from "../components/table/TableHeader";
import TableMessage from "../components/table/TableMessage";

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
        customer: customers?.map((customer) => ({
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

  //INPUTS
  const inputs = [
    {
      id: 0,
      disabled: showAll,
      aria_label: "nome cliente",
      placeholder: "Cerca per nome",
      value: name,
      onChange: (e: any) => setName(e.target.value),
    },
    {
      id: 1,
      disabled: showAll,
      aria_label: "email cliente",
      placeholder: "Cerca per email",
      value: email,
      onChange: (e: any) => setEmail(e.target.value),
    },
  ];

  //BUTTONS
  const buttons = [
    {
      id: 0,
      label: "cerca",
      onClick: fetchFilterCustomers,
      disabled:
        (name.trim() === "" && email.trim() === "") || loading || showAll,
    },
    {
      id: 1,
      label: "mostra tutti",
      onClick: resetFilterCustomers,
      disabled: !showAll || loading,
    },
    {
      id: 2,
      label: "genera xml",
      bg: "green",
      disabled: loading || customers.length === 0,
      onClick: generateCustomersXML,
    },
  ];

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Customers
      </Typography>

      {/* HEADER TABELLA */}
      <TableHeader inputs={inputs} buttons={buttons} />

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* ALERT TABELLA */}
          <TableMessage
            showAll={showAll}
            data={customers}
            input_labels={[name, email]}
            tableName={"Clienti"}
          />
          {/* TABELLA */}
          <Table_
            labels={customers.length > 0 ? Object.keys(customers[0]) : [""]}
            data={customers.length > 0 ? customers : []}
          />

          {/* MODALE PER DOWNLOAD XML */}
          <Modal
            open={openModal}
            close={handleModalClose}
            title="Scarica CUSTOMERS XML"
          >
            <Link
              href={xmlURL}
              download="customers.xml"
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
