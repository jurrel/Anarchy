import { useState } from 'react';
import { Modal } from '../../context/Modal/Modal';
import Menu  from './menu-modal';
import './menu.css';


function MenuModal() {

  const [showModal, setShowModal] = useState(false);


  return (
    <div>
      <button className='settings' onClick={() => setShowModal(!showModal)} ><i className="fa fa-gear fa-2x" /></button>
      {showModal && (
      <Modal className='menu-modal' onClose={() => setShowModal(false)}>
        <>
          <Menu setShowModal={setShowModal} showModal={showModal} />
        </>
        </Modal>
      )}
    </div>
  );
}

export default MenuModal;
