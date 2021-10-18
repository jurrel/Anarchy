import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Peer from 'peerjs';

import './video.css';

// const myPeer = new Peer(undefined, {
//       host: process.env.NODE_ENV === 'production' ? 'anarchy-app.herokuapp.com' : 'localhost',
//       port: 9000,
//       path: '/myapp'
// });

const myPeer = process.env.NODE_ENV === 'production' ? new Peer(undefined) : 
    new Peer(undefined, {
      host: 'localhost',
      port: 9000,
      path: '/myapp'
})


function VideoChat({setShowModal, socket, setCall}) {

    const user = useSelector(state => state.session.user);

    const [members, setMembers] = useState(0);


    useEffect(() => {
        const peers = {};

        function connectToNewUser(peerId, stream) {

            const call = myPeer.call(peerId, stream);

            const vidContainer = document.createElement('div');
            vidContainer.setAttribute('class', 'vid-container');

            const video = document.createElement('video');
            video.setAttribute('class', 'stream');
            vidContainer.append(video);
            call.on('stream', userVideoStream => {
                addVideo(video, vidContainer, userVideoStream);
            })
            call.on('close', () => {
                vidContainer.remove();
            })

            peers[peerId] = call

        }

        function addVideo(video, myVidContainer, stream) {
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
                socket.emit('hang_up', myPeer.id)
                stream.getTracks().forEach(track => track.stop());
                myVidContainer.remove();
                setCall(false);
                setShowModal(false);
            })
        }

        let discover = document.getElementById('myVideo');
        if (!discover) {
            const videoGrid = document.getElementById('video-grid');
            const myVidContainer = document.createElement('div');
            myVidContainer.setAttribute('class', 'my-vid-container');

            const myVideo = document.createElement('video');
            myVideo.setAttribute('class', 'stream');
            myVideo.setAttribute('id', 'myVideo');
            myVideo.muted = true;
            myVidContainer.append(myVideo);

            const hangUpButton = document.createElement('button');
            hangUpButton.innerText = 'Hang Up';
            hangUpButton.setAttribute('id', 'hang-up');
            videoGrid.append(hangUpButton);

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {

                addVideo(myVideo, myVidContainer, stream);

                socket.emit('join', myPeer.id);

                socket.on('join', (peerId) => {
                    connectToNewUser(peerId, stream);
                    setMembers(members + 1);
                })

                myPeer.on('call', connection => {
                    connection.answer(stream);

                    const vidContainer = document.createElement('div');
                    vidContainer.setAttribute('class', 'vid-container');

                    const video = document.createElement('video');
                    video.setAttribute('id', 'peer');
                    video.setAttribute('class', 'stream');

                    connection.on('stream', userVideoStream => {
                        if (!stream) {
                            addVideo(video, vidContainer, userVideoStream);
                        }
                    })
                    socket.on('hang_up', (peerId) => {
                        if(peers[peerId]) peers[peerId].close()
                        setCall(false);
                        setShowModal(false);
                        window.location.reload();
                    })

                    connection.on('close', () => {
                    })
                })
            })
        }


        return () => socket.off('hang_up');

    }, [members, setCall, setShowModal, socket, user.id])


    return (
        <>
            <div id='video-grid'></div>
        </>
    )
}

export default VideoChat
