const username = prompt("What is your username?")
// const socket = io('http://localhost:9000'); // the / namespace/endpoint
const socket = io('http://localhost:9005',{
    query: {
        username
    }
});
let nsSocket = "";
// listen for nsList, which is a list of all the namespaces.
socket.on('nsList',(nsData)=>{
    
})