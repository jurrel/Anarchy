import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Search({ socket, setServers, setShowModal, servers }) {

    const user = useSelector(state => state.session.user);

    const [results, setResults] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {

        socket.on('search', results => {
            console.log(results)
            if (!value) {
                setResults('');
            } else {
                setResults(results);
            }
        })

        return () => socket.off('search')
    }, [socket, value])

    useEffect(() => {
        
        const closeModal = (e) => {
            if (!e.target.closest('#search-modal')) {
                setShowModal(false)
            }
        }
        document.addEventListener('click', closeModal)

        return () => document.removeEventListener('click', closeModal)
    }, [setShowModal])

    useEffect(() => {

        socket.on('join-server', result => {
            const server = servers.filter(server => server.id === result.id);
            console.log(result, result['join-user'], user.id, server)
            if (!server.length && result['join-user'] === user.id) {
                setServers([ ...servers, result ])
            } else {
                console.log('its working!')
            }
        } )

        return () => socket.off('join-server')
    }, [servers, setServers, socket, user])

    const handleSearch = (e) => {
        e.preventDefault();

        socket.emit('search', value);
    }

    const joinServer = (result) => {
        console.log(result)
        const data = {
            'user_id': user.id,
            'server_id': result.id
        }

        socket.emit('join-server', data)
    }

    return (
        <div id='search-modal'>
            <form onSubmit={handleSearch}>
                <input id='search-bar' value={value} onChange={(e) => {
                    setValue(e.target.value);
                    socket.emit('search', value);
                }} placeholder='Search Servers'></input>
            </form>
            <ul id='list'>
                { results && results.map(result => (
                    <li className='list-item' onClick={() => joinServer(result)} key={result.id}>
                        <img src={result.imageUrl} alt='serve'></img>
                        <p>{result.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Search;