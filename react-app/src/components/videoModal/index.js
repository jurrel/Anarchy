import { useState, useEffect } from 'react';
import { Modal } from '../context/Modal/Modal';
import { Socket } from '../context/socket';
import VideoChat from './video-chat';


function VideoModal({ serverId, friend, setCall, call }) {
  const socket = Socket();
  const [showModal, setShowModal] = useState(false);


  const videoChat = () => {
    socket.emit('call', friend)
    if (call) {
      setShowModal(true);
      socket.emit('answer', friend)
    }
  }


  useEffect(() => {

    

    socket.on('call', (friend) => {
      setCall(true);
    })

    
    return () => socket.off('call')
  })
  
  useEffect(() => {
    
    socket.on('answer', (friend) => {
      const ring = document.getElementById('ringtone');
      const source = ring.src;
      ring.src = source;
      setShowModal(true);
    })

    return () => socket.off('answer')

  })


  return (
    <>
      <button id={call ? 'ringing' : ''} onClick={videoChat} type='button'><i className="fas fa-video" /></button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <>
            <VideoChat setCall={setCall} friend={friend} serverId={serverId} setShowModal={setShowModal} showModal={showModal} />
            <button id='close-modal' onClick={() => setShowModal(false)}>CLOSE</button>
          </>
        </Modal>
      )}
    </>
  );
}

export default VideoModal;
