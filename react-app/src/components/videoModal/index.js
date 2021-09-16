import { useState, useEffect } from 'react';
import { Modal } from '../context/Modal/Modal';
import VideoChat from './video-chat';

// socket.send('connect')

function VideoModal({ serverId }) {
  const [showModal, setShowModal] = useState(false);


  const videoChat = () => {
    setShowModal(true);
  }


  return (
    <>
      <button onClick={() => {setShowModal(true)}}>CHAT ROOM</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <>
            <VideoChat serverId={serverId} setShowModal={setShowModal} showModal={showModal} />
            <button id='close-modal' onClick={() => setShowModal(false)}>CLOSE</button>
          </>
        </Modal>
      )}
    </>
  );
}

export default VideoModal;