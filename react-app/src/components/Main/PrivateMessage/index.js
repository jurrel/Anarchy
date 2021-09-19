import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../../context/Modal/Modal';
import PrivateMessage from './private-message';


function PrivateMessageModal({ socket, friend }) {
  const user = useSelector(state => state.session.user);
  
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <button onClick={() => setShowModal(true)} type='button'><i className="fas fa-comment-dots" /></button>
      {showModal && (
      <Modal className='message-modal' onClose={() => setShowModal(false)}>
        <>
          <PrivateMessage setShowModal={setShowModal} socket={socket} friend={friend} />
        </>
        </Modal>
      )}
    </>
  );
}

export default PrivateMessageModal;
