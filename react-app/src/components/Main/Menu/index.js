import { useState } from 'react';
import { Modal } from '../../context/Modal/Modal';
import Menu  from './menu-modal';
import './menu.css';


function MenuModal({ socket }) {
  
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <button className='settings' onClick={() => setShowModal(!showModal)} ><i className="fa fa-gear fa-2x" /></button>
      {showModal && (
      <Modal className='menu-modal' onClose={() => setShowModal(false)}>
        <>
          <Menu socket={socket} setShowModal={setShowModal} showModal={showModal} />
        </>
        </Modal>
      )}
    </>
  );
}

export default MenuModal;



                  