import React, { useState } from "react";
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

const DataTable = ({ rows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
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
              <TableCell align="left">City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={`${row.name}-${row.brand}-${row.model}`}>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.equipment}</TableCell>
                <TableCell align="left">{row.brand}</TableCell>
                <TableCell align="left">{row.model}</TableCell>
                <TableCell align="left">{row.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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
