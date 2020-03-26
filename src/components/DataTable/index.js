import React, { useState } from "react";
import PropTypes from 'prop-types';
import {
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TablePagination,
  Typography
} from "@material-ui/core";

import "./DataTable.scss";

const NO_RESULTS_LABEL = 'No results match your search criteria.'

const DataTable = ({ rows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRows = (rows) => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const rowsToDisplay = getRows(rows);
  return (
    <>
      <TableContainer className="table__container">
        <Table aria-label="data table" table-layout="auto">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Equipment</TableCell>
              <TableCell align="left">Brand</TableCell>
              <TableCell align="left">Model</TableCell>
              <TableCell align="left">Quantity</TableCell>
              <TableCell align="left">Country</TableCell>
              <TableCell align="left">City</TableCell>
              <TableCell align="left">Notes</TableCell>
            </TableRow>
          </TableHead>
          {rowsToDisplay.length > 0
            ?
            <TableBody>
              {
                rowsToDisplay.map(row => (
                  <TableRow key={row.entity_pk}>

                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.equipment}</TableCell>
                    <TableCell align="left">{row.brand}</TableCell>
                    <TableCell align="left">{row.model}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">{row.country}</TableCell>
                    <TableCell align="left">{row.city}</TableCell>
                    <TableCell align="left">{row.notes}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
            :
            <Typography variant='body1' className='table__message'> {NO_RESULTS_LABEL} </Typography>}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20]}
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
    name: PropTypes.string,
    equi: PropTypes.string,
    bran: PropTypes.string,
    mode: PropTypes.string,
    city: PropTypes.string,
  }))
};

export default DataTable;
