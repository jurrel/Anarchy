import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../../context/Modal/Modal';
import PrivateMessage from './private-message';


function PrivateMessageModal({ socket, friend }) {
  const user = useSelector(state => state.session.user);
  
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <button onClick={() => setShowModal(!showModal)} type='button'><i className="fas fa-comment-dots" /></button>
      <button className='settings' onClick={() => setShowModal(!showModal)} ><i className="fa fa-gear fa-2x" /></button>
      {showModal && (
      <Modal className='menu-modal' onClose={() => setShowModal(false)}>
        <>
        <PrivateMessage socket={socket} friend={friend} />
        </>
        </Modal>
      )}
    </>
  );
}

export default PrivateMessageModal;
