import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Modal } from 'reactstrap';

import './index.scss';

const MessageBlock = (props) => {
  const { isVisible, message } = props;

  return (
    <Modal className="message-block" isOpen={isVisible}>
      <Alert className="mb-0" color="danger">
        {message}
      </Alert>
    </Modal>
  );
};

MessageBlock.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

export default MessageBlock;
