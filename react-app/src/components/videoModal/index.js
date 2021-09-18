import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../context/Modal/Modal';
import VideoChat from './video-chat';

// socket.send('connect')

function VideoModal({ serverId, socket, friend }) {
  const [showModal, setShowModal] = useState(false);

  const user = useSelector(state => state.session.user);


  const videoChat = () => {
    setShowModal(true);
    socket.emit('call', friend)
  }


  useEffect(() => {
    socket.on('call', (friend) => {
      console.log('CALLING', friend)
      if (friend.id === user.id) {
        setShowModal(true);
      }
    })

    return () => socket.off('call')
  })


  return (
    <>
      <button onClick={videoChat} type='button'><i className="fas fa-video" /></button>
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