import React, { useState } from "react";
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";
import { Text } from "@mantine/core";

function str2xml(str: any) {
  if (str.charCodeAt(0) === 65279) {
    // BOM sequence
    str = str.substr(1);
  }
  return new DOMParser().parseFromString(str, "text/xml");
}

function getParagraphs(content: any) {
  const zip = new PizZip(content);
  const xmlText = zip.files["word/document.xml"].asText();
  const xml = str2xml(xmlText)
  const tablesXml = xml.getElementsByTagName("w:tbl");
  const tables = [];
  for (let i = 0; i < tablesXml.length; i++) {
    const table = tablesXml[i];
    const rowsXml = table.getElementsByTagName("w:tr");
    const tableData = [];

    for (let j = 0; j < rowsXml.length; j++) {
      const row = rowsXml[j];
      const cellsXml = row.getElementsByTagName("w:tc");
      const rowData = [];

      for (let k = 0; k < cellsXml.length; k++) {
        const cell = cellsXml[k];
        const textsXml = cell.getElementsByTagName("w:t");

        let cellText = "";

        for (let l = 0; l < textsXml.length; l++) {
          const textXml = textsXml[l];
          if (textXml.childNodes) {
            cellText += textXml.childNodes[0].nodeValue || "";
          }
        }

        rowData.push(cellText);
      }

      tableData.push(rowData);
    }

    tables.push(tableData);
  }

  return tables;
}

const DocxReader = () => {
  const [paragraphs, setParagraphs] = useState([]);

  const onFileUpload = (event: any) => {
    const reader = new FileReader();
    let file = event.target.files[0];

    reader.onload = (e: any) => {
      const content = e.target.result;
      const paragraphs1: any = getParagraphs(content);
      setParagraphs(paragraphs1);
    };

    reader.onerror = (err) => console.error(err);
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <input type="file" onChange={onFileUpload} name="docx-reader" />
      {paragraphs.map((x) => {
        <Text>{x}</Text>;
      })}
    </>
  );
};

export default DocxReader;
