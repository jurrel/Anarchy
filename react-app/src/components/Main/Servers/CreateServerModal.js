import { Modal } from "../../context/Modal/Modal";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

function CreateServerModal({ socket }) {
    const user = useSelector(state => state.session.user)
    const servers = useSelector((state) => state.session.servers);
    const [showModal, setShowModal] = useState(false);
    const [name,setName] = useState('');
    const [imageUrl, setImageUrl] = useState('https://mymusicdb.s3.us-east-2.amazonaws.com/anarchy/profiles/default.png')
    const [allServers, setAllServers] = useState(servers);

    useEffect(() => {
        socket.on('new-server', (server) => {
            setAllServers([...allServers, server])
        });
        return () => socket.disconnect()

    }, [allServers, socket]);

    const handleCreateServer = async e => {
        e.preventDefault();

        const newServer = {
            name,
            owner_id: user.id,
            imageUrl      
        }
        socket.emit('new-server', newServer);
        return
    }

    const updateServerName = (e) => setName(e.target.value)
    const updateServerImage = (e) => setImageUrl(e.target.value)



    return (
        <>
            <button onClick={() => setShowModal(true)}><i className="fa fa-plus" /></button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <form onSubmit={handleCreateServer}>
                        <input type='text' placeholder='Server name' onChange={updateServerName}></input>
                        <input type='file' onChange={updateServerImage}></input>
                        <div>
                            <button type="submit">Create</button>
                        </div>
                   </form>
                </Modal>
            )}
        </>
    );
}

export default CreateServerModal