const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);
const { v4 } = require("uuid");

app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', (req, res, next) => {
    const roomId = v4();
    return res.redirect(`/${roomId}`)
});

app.get('/:roomId', (req, res, next)=> {
    return res.render("chatRoom", {roomId : req.params.roomId});
});

io.on('connection', socket => {
    socket.on('enter-call', (roomId, userId) => {
        console.log(roomId, userId);
    })
})

server.listen(5000);