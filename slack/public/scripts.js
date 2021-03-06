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
            joinNs(nsEndpoint);
        });
    });
    
    joinNs("/wiki");
});