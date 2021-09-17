import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../../context/Modal/Modal';
import Menu  from './menu-modal';
import './menu.css';


function MenuModal() {
  const user = useSelector(state => state.session.user);
  
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <button className='settings' onClick={() => setShowModal(!showModal)} ><i className="fa fa-gear fa-2x" /></button>
      {showModal && (
      <Modal className='menu-modal' onClose={() => setShowModal(false)}>
        <>
          <Menu setShowModal={setShowModal} showModal={showModal} />
        </>
        </Modal>
      )}
    </>
  );
}

export default MenuModal;



                  