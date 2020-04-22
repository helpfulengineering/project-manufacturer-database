import React, { useState, useEffect, useContext } from 'react';
import validate from 'validate.js';
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
import Typography from "@material-ui/core/Typography";

const isEmail = value => validate.single(value, {presence: true, email: true}) === undefined;

const ContactFormModal = ({
  open,
  onClose,
  selectedEntityId,
}) => {
  const token = useContext(TokenContext);
  const contactVolunteerApi = new ContactVolunteerApi(token);
  const [errors, setErrors] = useState({});
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState(''); // this might get annoying to have to enter multiple times. maybe read from the token?
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      setUserName('');
      setUserEmail('');
      setMessage('');
      setIsSending(false);
      setIsSent(false);
    }
  }, [open]);

  const getErrors = () => {
    const _errors = {};
    if (isEmpty(userName) || userName.length < 1 || userName.length > 24) {
      _errors.userName = true;
    }
    if (isEmpty(userEmail) || !isEmail(userEmail)) {
      _errors.userEmail = true;
    }
    if (isEmpty(message)  || message.length < 80 || message.length > 2000) {
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
        entityUserId: selectedEntityId,
      }).then(() => {
        setIsSending(false);
        setIsSent(true);
      }).catch((e) => {
        setIsSending(false);
        setErrors({
          ...errors,
          sendError: e,
        })
      });
    }
  };

  return (
    <Modal open={open}
      onClose={onClose}>
      {isSent ?
        <Typography paragraph={true}>
          The email has been sent.
        </Typography>
        : <div>
          {errors.sendError &&
          <Alert severity="error">Your Message failed to Send! Please Try Again Later.<br/> {JSON.stringify(errors.sendError)}</Alert>
          }
          <div className="contact-form-modal">
            <div className="modal-inputs-wrapper">
              <div className="input-wrapper">
                <TextField className="modal-input"
                           label="Your Name"
                           helperText={'between 1 and 24 chars'}
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
                           placeholder={"abc@xyz.com"}
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
                           helperText={`between 80 and 2000 chars (${message.length})`}
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
        </div>
      }
    </Modal>
  );
};

ContactFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedEntityId: PropTypes.number.isRequired,
};

export default ContactFormModal;
