const socket = io('/');

const peer = new Peer(undefined, {
    host : '/', 
});

peer.on('open', (id) => {
    socket.emit('enter-call', RID, id);
})

socket.on('user-connected', (userId) => {
    console.log(userId);
});