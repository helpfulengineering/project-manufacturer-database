import React from 'react';
import PropTypes from 'prop-types';
import Papa from 'papaparse';

import Button from '@material-ui/core/Button';
import {trackEvent} from "../../analytics";
import {ROWS} from "../../data/proptypes";

const ExportControl = ({rows, className}) => {
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

    const containsEmails = rows.some( ({email}) => email && email.length > 0);
    trackEvent('export-csv', { rows: rows.length, hasContact: containsEmails });
  }
  return (
    <Button variant="outlined"
      onClick={createCSV}
      color="primary"
      size="small"
      disabled={!(rows && rows.length > 0)}
      className={className}>
      Export Records
    </Button>
  );
};

ExportControl.propTypes = {
  rows: ROWS,
  className: PropTypes.string,
};

export default ExportControl;
