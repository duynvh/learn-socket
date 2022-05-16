const express = require('express');
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9005);
const io = socketio(expressServer);

io.on('connection',(socket) => {
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint,
        };
    });

    socket.emit("nsList", nsData);
});

let namespaces = require('./data/namespaces');
namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', nsSocket => {
        console.log(`${nsSocket.id} has join ${namespace.endpoint}`);

        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin, numberOfUserCallback) => {
            nsSocket.join(roomToJoin);
            let clients = io.of('/wiki').adapter.rooms.get(roomToJoin);
            numberOfUserCallback(clients.size);
        });

        nsSocket.on("newMessageToServer", msg => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: "rbunch",
                avatar: "https://via.placeholder.com/30"
            }
            const roomTitle = nsSocket.rooms.values().next().value;
            io.of("/wiki").to(roomTitle).emit("messageToClients", fullMsg);
        })
    })
});