const username = prompt("What is your username?")
// const socket = io('http://localhost:9000'); // the / namespace/endpoint
const socket = io('http://localhost:9005',{
    query: {
        username
    }
});
let nsSocket = "";
// listen for nsList, which is a list of all the namespaces.
socket.on('nsList',(nsData) => {
    let namespacesDiv = document.querySelector(".namespaces"); 
    namespacesDiv.innerHTML = "";

    nsData.forEach((ns) => {
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
    });

    // Add a clicklistener for each NS
    Array.from(document.getElementsByClassName("namespace")).forEach((ele) => {
        ele.addEventListener('click', (e) => {
            const nsEndpoint = ele.getAttribute("ns");
            console.log(`${nsEndpoint} I should go to now`);
        });
    });

    // const nsSocket = io('http://localhost:9005/wiki');
    // nsSocket.on('nsRoomLoad', (nsRooms) => {
    //     let roomList = document.querySelector('.room-list');
    //     roomList.innerHTML = "";

    //     nsRooms.forEach((room) => {
    //         let glyph;
    //         if (room.privateRoom) {
    //             glyph = "lock";
    //         } else {
    //             glyph = "globe";
    //         }

    //         roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
            
    //         // Add click listener to each room
    //         let roomNodes = document.getElementsByClassName('room');
    //         Array.from(roomNodes).forEach((elem) => {
    //             elem.addEventListener('click', (e) => {
    //                 console.log(`I should go to now`);
    //             });
    //         })
    //     });
    // })

    joinNs("/wiki");
});