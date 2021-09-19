import { useState } from 'react';
import { Modal } from '../../components/context/Modal/Modal';
import Search from './search';

import './search.css';

function SearchModal({ socket, setServers, servers }) {
  
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <button id='search-button' onClick={() => setShowModal(!showModal)} type='button'><i className="fas fa-search fa-2x" /></button>
      {showModal && (
      <Modal className='message-modal' onClose={() => setShowModal(false)}>
        <>
            <Search servers={servers} setServers={setServers} socket={socket} setShowModal={setShowModal} />
        </>
        </Modal>
      )}
    </>
  );
}

export default SearchModal;
