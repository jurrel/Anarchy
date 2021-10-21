import { useState, useEffect } from 'react';
import { Modal } from '../context/Modal/Modal';

import Home from './home';
import '../Main/Servers/servers.css';


function HomeModal({ servers }) {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
      if (!showModal) return;

    const closeModal = () => {
        setShowModal(!showModal);
    }
    document.addEventListener('click', closeModal)
    
    return () => document.removeEventListener('click', closeModal);
  })


  return (
    <>
      <button className='logout' onClick={() => {setShowModal(!showModal)}} type='button'><i className="fas fa-home fa-2x" /></button>
      {showModal && (
        <Modal className='about-modal' onClose={() => setShowModal(!showModal)}>
            <Home servers={servers} />
        </Modal>
      )}
    </>
  );
}

export default HomeModal;