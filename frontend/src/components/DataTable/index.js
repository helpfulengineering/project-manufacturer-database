import React, { useState, useEffect } from "react";
import {
  Button,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TablePagination,
  Tooltip
} from "@material-ui/core";

import "./DataTable.scss";
import {ADDITIONAL_AUTHORIZATION_LABEL } from "../../labels";
import {MAX_QUERY_SIZE} from "../../config";
import {LimitReachedAlert} from "../Alerts";
import ContactFormModal from '../ContactFormModal';
import {useAuth0} from "../../auth/react-auth0-spa";
import {ROWS} from "../../data/proptypes";

const NO_RESULTS_LABEL = 'No results match your search criteria.';
const DERIVED_FIELD_LABEL = 'This field has been derived from other fields. (Not provided by user directly)';

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
  
  const { isAuthenticated } = useAuth0();
  const [page, setPage] = useState(0);
  const [isEndOfQuery, setIsEndOfQuery] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState(0);
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

  const openContactForm = (selectedEntityId) => {
    setSelectedEntityId(selectedEntityId);
    setIsContactFormOpen(true)
  };

  const getContactButtonText = (isAuthenticated, isValidEmail) => {
    if (isValidEmail) {
      if (isAuthenticated) {
        return 'send email';
      } else {
        return 'login required';
      }
    } else {
        return 'no email for volunteer';
    }
  };

  function ContactButton({row, isAuthenticated}){
      return(
        <Button
        disabled={!row.is_valid_email || !isAuthenticated}
        title={getContactButtonText(isAuthenticated, row.is_valid_email)}
        variant="outlined"
        color="primary"
        size="small"
        onClick={() => openContactForm(row.entity_pk)}>
          Contact
      </Button>
      )
    }

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
              <TableCell align="left" title={DERIVED_FIELD_LABEL}>Scale*</TableCell>
              <TableCell align="left">City</TableCell>
              <TableCell align="left">Country</TableCell>
              <TableCell align="left">Experience</TableCell>
              <TableCell align="left">Notes</TableCell>
              <TableCell align="left" title={ADDITIONAL_AUTHORIZATION_LABEL}>Slack*</TableCell>
              <TableCell align="left" title={ADDITIONAL_AUTHORIZATION_LABEL}>Email*</TableCell>
              <TableCell align="left" title={ADDITIONAL_AUTHORIZATION_LABEL}>Contact*</TableCell>
            </TableRow>
          </TableHead>
          {rowsToDisplay.length > 0
            ?
            <TableBody>
              {
                rowsToDisplay.map(row => (
                  <TableRow key={row.pk} className={`row-scale-${(row.scale || '').toLowerCase()}`}>
                    <TableCell align="left">{row.name}</TableCell>
                    {/*<TableCell align="left">{row.equipment}</TableCell>*/}
                    {/*<TableCell align="left">{row.brand}</TableCell>*/}
                    <TableCell align="left">{row.model}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">{row.scale}</TableCell>
                    <TableCell align="left">{row.city}</TableCell>
                    <TableCell align="left">{row.country}</TableCell>
                    <TableCell align="left">{breakUpString(row.experience)}</TableCell>
                    <TableCell align="left">{breakUpString(row.notes)}</TableCell>
                    <TableCell align="left">{row.slack_handle}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">
                    {(row.is_valid_email || !isAuthenticated) ? 
                      <Tooltip title='To be able to contact volunteers you must log in first.' className='tooltip'>
                        <span>
                          <ContactButton row={row} isAuthenticated={isAuthenticated} />
                        </span>
                      </Tooltip>
                    :  
                    <ContactButton row={row} isAuthenticated={isAuthenticated} />
                    }
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
            :
            <TableBody>
              {
                <TableRow>
                  <TableCell align="center" colSpan="13">{NO_RESULTS_LABEL}</TableCell>
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
      <ContactFormModal open={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        selectedEntityId={selectedEntityId} />
    </>
  );
};

DataTable.propTypes = {
  rows: ROWS
};

export default DataTable;
