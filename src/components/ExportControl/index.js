import React from 'react';
import Papa from 'papaparse';

import Button from '@material-ui/core/Button';
import DataTable from "../DataTable";
import {trackEvent} from "../../analytics";

const ExportControl = ({rows}) => {
  function createCSV() {
    const csvString = Papa.unparse(rows);
    const csvBlob = new Blob([csvString], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.download = 'export.csv';
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    document.body.removeChild(hiddenElement);

    trackEvent('export-csv', { rows: rows.length });
  }
  return (
    <Button variant="outlined"
      onClick={createCSV}
      size="small">
      Export Records
    </Button>
  );
};

ExportControl.propTypes = {
  ...DataTable.propTypes, // NOTE, extension of inputs used by table
};

export default ExportControl;
