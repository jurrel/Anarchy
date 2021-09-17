import { useState, useEffect } from 'react';
import { Modal } from '../context/Modal/Modal';
import VideoChat from './video-chat';

// socket.send('connect')

function VideoModal({ serverId, socket, friend }) {
  const [showModal, setShowModal] = useState(false);


  const videoChat = () => {
    setShowModal(true);
  }


  return (
    <>
      <button onClick={() => {setShowModal(true)}} type='button'><i className="fas fa-video" /></button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <>
            <VideoChat friend={friend} socket={socket} serverId={serverId} setShowModal={setShowModal} showModal={showModal} />
            <button id='close-modal' onClick={() => setShowModal(false)}>CLOSE</button>
          </>
        </Modal>
      )}
    </>
  );
}

export default VideoModal;