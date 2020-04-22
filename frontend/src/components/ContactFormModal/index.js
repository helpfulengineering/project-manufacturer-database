import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import isEmpty from 'lodash/isEmpty';

import Modal from '../Modal';
import ContactVolunteerApi from '../../data/contactVolunteerApi';
import TokenContext from '../../auth/tokenContext';

import './ContactFormModal.scss';

const ContactFormModal = ({
  open,
  onClose,
  selectedContactId,
}) => {
  const token = useContext(TokenContext);
  const contactVolunteerApi = new ContactVolunteerApi(token);
  const [errors, setErrors] = useState({});
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState(''); // this might get annoying to have to enter multiple times. maybe read from the token?
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      setUserName('');
      setUserEmail('');
      setMessage('');
      setIsSending(false);
    }
  }, [open]);

  const getErrors = () => {
    const _errors = {};
    if (isEmpty(userName)) {
      _errors.userName = true;
    }
    if (isEmpty(userEmail)) {
      _errors.userEmail = true;
    }
    if (isEmpty(message)) {
      _errors.message = true;
    }
    return _errors;
  };
  const send = () => {
    const _errors = getErrors();
    setErrors(_errors);
    if (isEmpty(_errors)) {
      setIsSending(true);
      contactVolunteerApi.sendMessage({
        userName,
        userEmail,
        message,
        contactUserId: selectedContactId,
      }).then(() => {
        setIsSending(false);
        onClose();
      }).catch((e) => {
        setErrors({
          ...errors,
          sendError: e,
        })
      });
    }
  }

  return (
    <Modal open={open}
      onClose={onClose}>
        {errors.sendError &&
          <Alert severity="error">Your Message Failed to Send! Please Try Again Later.<br/> {errors.sendError}</Alert>
        }
      <div className="contact-form-modal">
        <div className="modal-inputs-wrapper">
          <div className="input-wrapper">
            <TextField className="modal-input"
              label="Your Name"
              required
              error={errors.userName}
              value={userName}
              inputProps={{maxLength: 24}}
              onChange={(event) => {
                setErrors({
                  ...errors,
                  userName: false,
                })
                setUserName(event.target.value)
              }} />
          </div>
          <div className="input-wrapper">
            <TextField className="modal-input"
              label="Your Email"
              required
              error={errors.userEmail}
              value={userEmail}
              inputProps={{maxLength: 2000}}
              onChange={(event) => {
                setErrors({
                  ...errors,
                  userEmail: false,
                });
                setUserEmail(event.target.value)
              }} />
          </div>
          <div className="input-wrapper">
            <TextField className="modal-input message-input"
              label="Message"
              multiline
              required
              inputProps={{maxLength: 2000}}
              error={errors.message}
              value={message}
              onChange={(event) => {
                setErrors({
                  ...errors,
                  message: false,
                })
                setMessage(event.target.value)
              }} />
          </div>
        </div>
        <Button className="send-button"
          onClick={send}
          disabled={isSending}
          color="primary"
          variant="contained">
          {isSending ? 'Sending' : 'Send Now'}
        </Button>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

ContactFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedContactId: PropTypes.number.isRequired,
};

export default ContactFormModal;