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
        const username = nsSocket.handshake.query.username;
        console.log(`${nsSocket.id} has join ${namespace.endpoint}`);

        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin, numberOfUserCallback) => {
            const iterator = nsSocket.rooms.values();
            iterator.next();
            const roomToLeave = iterator.next().value;
            
            if (roomToLeave) {
                nsSocket.leave(roomToLeave);
                updateUsersInRoom(namespace, roomToLeave);
            }
            
            nsSocket.join(roomToJoin);

            const nsRoom = namespace.rooms.find(room => {
                return room.roomTitle === roomToJoin;
            });

            nsSocket.emit("historyCatchUp", nsRoom.history);
            updateUsersInRoom(namespace, roomToJoin);
        });

        nsSocket.on("newMessageToServer", msg => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: "https://via.placeholder.com/30"
            }

            const iterator = nsSocket.rooms.values();
            iterator.next();
            const roomTitle = iterator.next().value;
            const nsRoom = namespace.rooms.find(room => {
                return room.roomTitle === roomTitle;
            });

            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);
        })
    })
});

function updateUsersInRoom(namespace, roomToJoin) {
    let clients = io.of(namespace.endpoint).adapter.rooms.get(roomToJoin);
    if (clients) {
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.size);
    }
}