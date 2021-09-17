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
        return () => {
            socket.disconnect();
        };

    }, [allServers, socket]);

    const handleCreateServer = async e => {
        e.preventDefault();
        const form = new FormData()
        form.append('name',name)
        form.append('owner_id', user.id)
        form.append('file', imageUrl)
        
        socket.emit('new-server', form);
        setShowModal(false)
        return
    }

    const handleCancle = async e => {
        e.preventDefault();
        setShowModal(false)
        return
    }

    const updateServerName = (e) => setName(e.target.value)
    const updateServerImage = (e) => setImageUrl(e.target.files[0])



    return (
        <>

            <i className="fa fa-plus" onClick={() => setShowModal(true)} title="Create Channel" />
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <form className='create-channel-modal' onSubmit={(e)=> handleCreateServer(e)}>
                        <input type='text' placeholder='Server name' onChange={(e) => updateServerName(e)}></input>
                        <input type='file' onChange={(e) => updateServerImage(e)}></input>
                        <div>
                            <button type="submit">Create</button>
                            <button type="button" onClick={handleCancle}>Cancle</button>
                        </div>
                   </form>
                </Modal>
            )}
        </>
    );
}

export default CreateServerModal