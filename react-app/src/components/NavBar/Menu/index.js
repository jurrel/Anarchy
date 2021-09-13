import { useState, useEffect } from 'react';
import { Modal } from '../../context/Modal/Modal';
import Menu  from './menu-modal';
import './menu.css';


function MenuModal() {
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <button id='menu' onClick={() => {setShowModal(!showModal)}}><i className="fas fa-bars fa-3x" /></button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <>
            <Menu setShowModal={setShowModal} showModal={showModal} />
          </>
        </Modal>
      )}
    </>
  );
}

export default MenuModal;
