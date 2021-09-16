import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

import './video.css';

const apiEndPoint = 'http://127.0.0.1:5000/';
const socket = io.connect(`${apiEndPoint}`);

const myPeer = new Peer(undefined, {
      host: 'localhost',
      port: 9000,
      path: '/myapp'
});


function VideoChat({setShowModal, showModal, serverId}) {
    
    const user = useSelector(state => state.session.user);
    
    const [members, setMembers] = useState(0);
    const [myVidId, setMyVidId] = useState('');
    
    
    useEffect(() => {

        function connectToNewUser(peerId, stream) {

            const call = myPeer.call(peerId, stream);
            console.log('connecting to new user')

            const vidContainer = document.createElement('div');
            vidContainer.setAttribute('class', 'vid-container');

            const video = document.createElement('video');
            // video.setAttribute('id', 'peerVid');
            video.setAttribute('class', 'stream');
            video.controls = true;
            vidContainer.append(video);
            call.on('stream', userVideoStream => {
                addVideo(video, vidContainer, userVideoStream);
            })
            call.on('close', () => {
                vidContainer.remove();
            })
        }

        function addVideo(video, myVidContainer, stream) {
            console.log('adding video')
            const videoGrid = document.getElementById('video-grid');
           
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play()
            })
    
            if (videoGrid) {
                myVidContainer.append(video);
                videoGrid.append(myVidContainer);
            }
    
            const hangUp = document.getElementById('hang-up');
            hangUp.addEventListener('click', () => {
                console.log('hang up!')
                stream.getTracks().forEach(track => track.stop());
                myVidContainer.remove();
                setShowModal(false);
            })
        }

        let discover = document.getElementById(`${myPeer.id}`);
        if (!discover) {
            const myVidContainer = document.createElement('div');
            myVidContainer.setAttribute('class', 'vid-container');

            const myVideo = document.createElement('video');
            myVideo.setAttribute('id', `${myPeer.id}`);
            myVideo.setAttribute('class', 'stream');
            myVideo.muted = true;
            myVideo.controls = true;
            myVidContainer.append(myVideo);
            
            const videoButton = document.createElement('button');
            videoButton.innerText = 'Video';
            videoButton.setAttribute('id', 'video');
            myVidContainer.append(videoButton);
            
            const hangUpButton = document.createElement('button');
            hangUpButton.innerText = 'Hang Up';
            hangUpButton.setAttribute('id', 'hang-up');
            myVidContainer.append(hangUpButton);
            
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true 
            }).then(stream => {

                addVideo(myVideo, myVidContainer, stream);

                socket.emit('join', myPeer.id);

                socket.on('join', (peerId) => {
                    console.log('someone else joined', peerId, myPeer.id)
                    connectToNewUser(peerId, stream);
                    setMembers(members + 1);
                })
                    
                myPeer.on('call', connection => {
                    console.log('CALL', connection)
                    connection.answer(stream);
                    
                    const vidContainer = document.createElement('div');
                    vidContainer.setAttribute('class', 'vid-container');
                    
                    const video = document.createElement('video');
                    video.setAttribute('id', 'peer');
                    video.setAttribute('class', 'stream');
                    video.controls = true;
                    
                    connection.on('stream', userVideoStream => {
                        console.log('STREAM');
                        addVideo(video, vidContainer, userVideoStream);
                    })
                })
            })
        }

        
        return () => socket.off('join');

    }, [members, serverId, setShowModal, showModal, user.id])


    return (
        <>
            <div id='video-grid'></div>
        </>
    )
}

export default VideoChat