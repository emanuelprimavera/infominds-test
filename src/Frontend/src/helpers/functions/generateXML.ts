/* eslint-disable @typescript-eslint/no-explicit-any */
import xml2js from "xml2js";

export const generateXML = (data_: any) => {
  // istanzio il builder
  const builder = new xml2js.Builder();

  // struttura del documento xml
  const data = data_;
  // genero stringa xml per metterla nel BLOB (il BLOB puo contenere qualsiasi tipo di dato, in questo caso è una stringa)
  const xmlData = builder.buildObject(data);

  // creo il BLOB e indico nel type il tipo di dato che è xmlData. creando il blob il browser puo "trattarlo" come un file
  const blob = new Blob([xmlData], { type: "application/xml" });

  // il browser ha bisogno di un link (temporaneo) per scaricare il BLOB quindi lo creo e lo ritorno per averlo nei componenti in cui serve
  return { xml_url: URL.createObjectURL(blob) };
};
