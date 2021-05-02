const socket = io('/');
const peer = new Peer(undefined, {
    host : '/', 
});

const grid = document.getElementById("grid");
const myVideo = document.createElement('video');
myVideo.muted = true;

const activeCalls = {};

peer.on('open', (id) => {
    socket.emit('enter-call', RID, id);
});

navigator.mediaDevices.getUserMedia({
    video : true, 
    audio : true
}).then((stream )=> {
    addStream(myVideo, stream);

    socket.on('user-connected', (userId) => {
        connectUser(userId, stream);
    });

    peer.on('call', (call) => {
        call.answer(stream);

        const oldVideo = document.createElement('video');
        call.on('stream', stream => {
            addStream(oldVideo, stream);
        });
    });
});

const addStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=> {
        video.play();
    });

    grid.append(video);
}

const connectUser = (userId, stream) => {
    const call = peer.call(userId, stream);

    const newVideo = document.createElement('video');
    call.on('stream', stream => {
        addStream(newVideo, stream);
    });

    call.on('close', ()=> {
        newVideo.remove();
    });

    activeCalls[userId] = call;
}

socket.on('user-disconnected', (userId) => {
    if(activeCalls[userId])
        activeCalls[userId].close();
});