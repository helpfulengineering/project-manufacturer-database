import React from 'react';
import PropTypes from 'prop-types';
import MaterialUiModal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
  },
}));

function Modal({
  open,
  onClose,
  children,
}) {
  const classes = useStyles();
  return (
    <MaterialUiModal open={open}
      onClose={onClose}>
        <div className={classes.paper}>
          {children}
        </div>
    </MaterialUiModal>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
}
Modal.defaultProps = {
  bool: false,
};

export default Modal;
