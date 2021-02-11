import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from 'reactstrap';

import Notification from '@images/409 Notification.png';

import './index.scss';

const MessageBlock = (props) => {
  const { isVisible } = props;

  return (
    <Modal className="message-block" isOpen={isVisible}>
      <img alt="warning" src={Notification} />
    </Modal>
  );
};

MessageBlock.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default MessageBlock;
