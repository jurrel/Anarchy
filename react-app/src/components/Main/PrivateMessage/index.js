import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../../context/Modal/Modal';
import PrivateMessage from './private-message';


function PrivateMessageModal({ socket, friend }) {
  const user = useSelector(state => state.session.user);
  
  const [showModal, setShowModal] = useState(false);
  const [unread, setUnread] = useState(false);
  const [messages, setMessages] = useState([...friend.messages]);
  const [message, setMessage] = useState('');


  useEffect(() => {
  socket.on('private-message', (message) => {
    console.log('private')
          setMessages([...messages, message]);
    setUnread(true);
  });

  return () => socket.off('private-message');
}, [messages, setUnread, socket]);



  return (
    <>
      <button id={unread ? 'new-message' : ''} onClick={() => setShowModal(true)} type='button'><i className="fas fa-comment-dots" /></button>
      {showModal && (
      <Modal className='message-modal' onClose={() => setShowModal(false)}>
        <>
          <PrivateMessage message={message} setMessage={setMessage} messages={messages} setMessages={setMessages} setUnread={setUnread} setShowModal={setShowModal} socket={socket} friend={friend} />
        </>
        </Modal>
      )}
    </>
  );
}

export default PrivateMessageModal;
