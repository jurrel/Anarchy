import { useState, useEffect } from 'react';
import { Modal } from '../../context/Modal/Modal';
import PrivateMessage from './private-message';


function PrivateMessageModal({ socket, friend }) {
  
  const [showModal, setShowModal] = useState(false);
  const [unread, setUnread] = useState(false);
  const [messages, setMessages] = useState(friend.messages ? [...friend.messages] : '');
  const [message, setMessage] = useState('');


  useEffect(() => {
    socket.on('private-message', (message) => {
      setMessages([...messages, message]);
      if (message.user_id === friend.id) {
        setUnread(true);
      }
    });

  // return () => socket.off('private-message');
}, [friend.id, messages, setUnread, socket]);



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
