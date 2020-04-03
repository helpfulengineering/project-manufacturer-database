import React from 'react';
import Papa from 'papaparse';

import Button from '@material-ui/core/Button';

const ExportControl = ({data}) => {
  function createCSV() {
    const csvString = Papa.unparse(data);
    const csvBlob = new Blob([csvString], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl
    hiddenElement.download = 'export.csv';
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    document.body.removeChild(hiddenElement);
  }
  return (
    <Button variant="outlined"
      onClick={createCSV}
      size="small">
      Export Records
    </Button>
  );
};

export default ExportControl;
