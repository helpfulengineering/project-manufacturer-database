import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TablePagination
} from "@material-ui/core";

import "./DataTable.scss";
import {ADDITIONAL_AUTHORIZATION_LABEL } from "../../labels";
import {MAX_QUERY_SIZE} from "../../config";
import {LimitReachedAlert} from "../Alerts";

const NO_RESULTS_LABEL = 'No results match your search criteria.';

const breakUpString = (string, delimiter=';') => {
  if (string) {
    const parts = string.split(delimiter);
    return (
      <>
        {parts.map(part => <div key={part.substring(0, 8)}>{part}</div>)}
      </>
    );
  }
  return '';
};

const DataTable = ({ rows }) => {
  const [page, setPage] = useState(0);
  const [isEndOfQuery, setIsEndOfQuery] = useState(false);
  const [rowsToDisplay, setRowsToDisplay] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    const start = page * rowsPerPage;
    const end = page * rowsPerPage + rowsPerPage;
    setIsEndOfQuery(end === MAX_QUERY_SIZE);
    setRowsToDisplay(rows.slice(start, end));
  }, [rows, rowsPerPage, page]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {isEndOfQuery &&
        <LimitReachedAlert />
      }
      <TableContainer className="table__container">
        <Table aria-label="data table" table-layout="auto">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              {/*<TableCell align="left">Equipment</TableCell>*/}
              {/*<TableCell align="left">Brand</TableCell>*/}
              <TableCell align="left">Model</TableCell>
              <TableCell align="left">Quantity</TableCell>
              <TableCell align="left">City</TableCell>
              <TableCell align="left">Country</TableCell>
              <TableCell align="left">Experience</TableCell>
              <TableCell align="left">Notes</TableCell>
              <TableCell align="left" title={ADDITIONAL_AUTHORIZATION_LABEL}>Slack*</TableCell>
              <TableCell align="left" title={ADDITIONAL_AUTHORIZATION_LABEL}>Email*</TableCell>
            </TableRow>
          </TableHead>
          {rowsToDisplay.length > 0
            ?
            <TableBody>
              {
                rowsToDisplay.map(row => (
                  <TableRow key={row.pk}>
                    <TableCell align="left">{row.name}</TableCell>
                    {/*<TableCell align="left">{row.equipment}</TableCell>*/}
                    {/*<TableCell align="left">{row.brand}</TableCell>*/}
                    <TableCell align="left">{row.model}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">{row.city}</TableCell>
                    <TableCell align="left">{row.country}</TableCell>
                    <TableCell align="left">{breakUpString(row.experience)}</TableCell>
                    <TableCell align="left">{breakUpString(row.notes)}</TableCell>
                    <TableCell align="left">{row.slack_handle}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
            :
            <TableBody>
              {
                <TableRow>
                  <TableCell align="center" colSpan="8">{NO_RESULTS_LABEL}</TableCell>
                </TableRow>
              }
            </TableBody>
        }
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    pk: PropTypes.number.isRequired,
    country: PropTypes.string,
    city: PropTypes.string,
    hasLocation: PropTypes.bool,
    lat: PropTypes.number,
    lng: PropTypes.number,
    name: PropTypes.string,
    notes: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    quantity: PropTypes.number,
  }))
};

export default DataTable;
