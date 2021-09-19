import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../context/Modal/Modal';
import VideoChat from './video-chat';

// socket.send('connect')

function VideoModal({ serverId, socket, friend, setCall, call }) {
  const [showModal, setShowModal] = useState(false);
  const [answerCall, setAnswerCall] = useState(false);


  const user = useSelector(state => state.session.user);


  const videoChat = () => {
    // setAnswerCall(true);
    socket.emit('call', friend)
    if (call) {
      setAnswerCall(true);
      setShowModal(true);
      socket.emit('answer', friend)
    }
    // setShowModal(true);
  }


  useEffect(() => {
    socket.on('call', (friend) => {
      console.log('CALLING', friend)
      setCall(true);

    })
    
    socket.on('answer', (friend) => {
      const ring = document.getElementById('ringtone');
      const source = ring.src;
      ring.src = source;
      setAnswerCall(true);
      setShowModal(true);
    })

    return () => socket.off()
  })


  return (
    <>
      <button id={call ? 'ringing' : ''} onClick={videoChat} type='button'><i className="fas fa-video" /></button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <>
            <VideoChat setAnswerCall={setAnswerCall} setCall={setCall} friend={friend} socket={socket} serverId={serverId} setShowModal={setShowModal} showModal={showModal} />
            <button id='close-modal' onClick={() => setShowModal(false)}>CLOSE</button>
          </>
        </Modal>
      )}
    </>
  );
}

export default VideoModal;